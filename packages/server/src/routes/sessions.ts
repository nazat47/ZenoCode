import { zValidator } from "@hono/zod-validator";
import { db } from "@zenocode/database/client";
import { Role, Mode, MessageStatus } from "@zenocode/database/enums";
import { Hono } from "hono";
import z from "zod";
import * as Sentry from "@sentry/hono/bun";
import type { AuthenticatedEnv } from "../middleware/require-auth";
import { isSupportedChatModel } from "../lib/models";
import { requireCredits } from "../middleware/require-credits";

const createSessionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  cwd: z.string().optional(),
  initialMessage: z
    .object({
      content: z.string().min(3, "Message must be at least 3 characters"),
      role: z.enum(Role),
      mode: z.enum(Mode),
      model: z.string().refine(isSupportedChatModel, "Unsupported model"),
    })
    .optional(),
});

const createSessionValidator = zValidator(
  "json",
  createSessionSchema,
  (result, c) => {
    if (!result.success) {
      Sentry.logger.error("Validation error", {
        path: c.req.path,
        issues: result.error.issues,
      });
      return c.json({ error: "Invalid request body" }, 400);
    }
  },
);

const app = new Hono<AuthenticatedEnv>()
  .get("/", async (c) => {
    const userId = c.get("userId");
    const result = await db.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });
    return c.json(result);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const userId = c.get("userId");
    const session = await db.session.findUnique({
      where: { id, userId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!session) {
      Sentry.logger.error("Session not found", {
        sessionId: id,
        userId: "mock-user",
      });
      return c.json({ error: "Session not found" }, 404);
    }
    return c.json(session);
  })
  .post("/", requireCredits, createSessionValidator, async (c) => {
    const { initialMessage, ...data } = c.req.valid("json");
    const userId = c.get("userId");

    const session = await db.session.create({
      data: {
        ...data,
        userId,
        ...(initialMessage && {
          messages: {
            create: {
              ...initialMessage,
              status: MessageStatus.COMPLETE,
            },
          },
        }),
      },
      include: { messages: true },
    });

    Sentry.logger.info("Session created successfully", {
      sessionId: session.id,
      title: session.title,
      userId: "mock-user",
    });

    return c.json(session, 201);
  });

export default app;
