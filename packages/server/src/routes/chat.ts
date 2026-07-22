import {
  getToolContracts,
  modeSchema,
  type ModeType,
  type ToolContracts,
} from "@zenocode/shared";
import {
  convertToModelMessages,
  streamText,
  validateUIMessages,
  type InferUITools,
  type LanguageModelUsage,
  type UIMessage,
} from "ai";
import z from "zod";
import { isSupportedChatModel, resolveChatModel } from "../lib/models";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthenticatedEnv } from "../middleware/require-auth";
import { requireCredits } from "../middleware/require-credits";
import { db } from "@zenocode/database/client";
import { buildSystemPrompt } from "../system-prompt";
import type { Prisma } from "../../../database/generated/prisma/client";
import { calculateCreditsForUsage } from "../lib/credits";
import { IngestAIUsage } from "../lib/polar";

type ChatMessageMetadata = {
  mode?: ModeType;
  model?: string;
  durationMs?: number;
  usage?: LanguageModelUsage;
};

type ZenocodeUIMessage = UIMessage<
  ChatMessageMetadata,
  never,
  InferUITools<ToolContracts>
>;

const submitSchema = z.object({
  id: z.string(),
  messages: z
    .array(
      z.custom<ZenocodeUIMessage>(
        (val) =>
          val !== null &&
          typeof val === "object" &&
          "id" in val &&
          "parts" in val,
      ),
    )
    .min(1),
  mode: modeSchema,
  model: z.string().refine(isSupportedChatModel, "unsupported model"),
});

const submitValidator = zValidator("json", submitSchema, (res, c) => {
  if (!res.success) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

const hasPendingToolCalls = (message: ZenocodeUIMessage) => {
  return message.parts.some((part) => {
    if (part.type === "dynamic-tool" || part.type.startsWith("tool-")) {
      const state = (part as { state?: string }).state;
      return state !== "output-available" && state !== "output-error";
    }
    return false;
  });
};

const app = new Hono<AuthenticatedEnv>().post(
  "/",
  requireCredits,
  submitValidator,
  async (c) => {
    const userId = c.get("userId");
    const { id, messages, mode, model } = c.req.valid("json");

    const session = await db.session.findUnique({
      where: { id, userId },
    });

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    const startTime = Date.now();
    const tools = getToolContracts(mode);
    const resolvedModel = resolveChatModel(model);
    const prevMessages = Array.isArray(session.messages)
      ? (session.messages as unknown as ZenocodeUIMessage[])
      : [];

    const mergedMessages = [...prevMessages];

    for (const msg of messages) {
      const incomingMessage = {
        ...msg,
        metadata: { ...msg.metadata, mode, model },
      } satisfies ZenocodeUIMessage;

      const existingMessageIndex = mergedMessages.findIndex(
        (m) => m.id === incomingMessage.id,
      );

      if (existingMessageIndex === -1) {
        mergedMessages.push(incomingMessage);
      } else {
        mergedMessages[existingMessageIndex] = incomingMessage;
      }
    }

    const nextMessages = await validateUIMessages<ZenocodeUIMessage>({
      messages: mergedMessages,
      tools,
    });

    const modelMessages = await convertToModelMessages(nextMessages, { tools });
    let completedUsage: LanguageModelUsage | null = null;

    const result = streamText({
      model: resolvedModel.model,
      system: buildSystemPrompt({ mode }),
      messages: modelMessages,
      tools,
      providerOptions: resolvedModel.providerOptions,
      onFinish(event) {
        completedUsage = event.usage;
      },
    });

    return result.toUIMessageStreamResponse<ZenocodeUIMessage>({
      originalMessages: nextMessages,
      messageMetadata({ part }) {
        if (part.type === "start") {
          return { mode, model };
        }

        if (part.type !== "finish") return undefined;

        return {
          mode,
          model,
          durationMs: Date.now() - startTime,
          ...(completedUsage ? { usage: completedUsage } : {}),
        };
      },
      async onFinish(event) {
        if (event.isAborted) return;

        if (hasPendingToolCalls(event.responseMessage)) return;

        await db.session.update({
          where: { id, userId },
          data: {
            messages: event.messages as unknown as Prisma.InputJsonValue,
          },
        });

        if (!completedUsage) return;

        try {
          const billableUsage = calculateCreditsForUsage({
            provider: resolvedModel.provider,
            model: resolvedModel.modelId,
            usage: completedUsage,
          });

          await IngestAIUsage({
            externalCustomerId: userId,
            eventId: `chat-message:${event.responseMessage.id}`,
            credits: billableUsage.credits,
          });
        } catch (error) {
          console.log(error);
        }
      },
      onError(error) {
        return error instanceof Error ? error.message : String(error);
      },
    });
  },
);

export default app;
