import type { InferResponseType } from "hono";
import SessionShell from "../components/session-shell";
import { apiClient } from "../lib/api-client";
import z from "zod";
import { BotMessage, ErrorMessage, UserMessage } from "../components/message";
import { useLocation, useNavigate, useParams } from "react-router";
import { useToast } from "../providers/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { getErrorMessage } from "../lib/http-errors";
import { useChat, type Message } from "../hooks/use-chat";
import {
  DEFAULT_CHAT_MODEL_ID,
  type ModeType,
  type SupportedChatModelId,
} from "@zenocode/shared";
import { useKeyboardLayer } from "../providers/keyboard-layer";
import { useKeyboard } from "@opentui/react";
import { usePromptConfig } from "../providers/prompt-config";

type SessionData = InferResponseType<
  (typeof apiClient.sessions)[":id"]["$get"],
  200
>;

const sessionLocationSchema = z.object({
  session: z.custom<SessionData>(
    (val) => val !== null && typeof val === "object" && "id" in val,
  ),
  initialPrompt: z
    .object({
      message: z.string(),
      mode: z.custom<ModeType>(),
      model: z.custom<SupportedChatModelId>(),
    })
    .optional(),
});

function ChatMessage({ msg }: { msg: Message }) {
  if (msg.role === "user") {
    const text = msg.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");
    return <UserMessage message={text} mode={msg.metadata?.mode ?? "BUILD"} />;
  }

  return (
    <BotMessage
      mode={msg.metadata?.mode ?? "BUILD"}
      duration={msg.metadata?.durationMs}
      streaming={false}
      parts={msg.parts}
      model={msg.metadata?.model ?? DEFAULT_CHAT_MODEL_ID}
    />
  );
}

function SessionChat({
  session,
  initialPrompt,
}: {
  session: SessionData;
  initialPrompt?: {
    message: string;
    mode: ModeType;
    model: SupportedChatModelId;
  };
}) {
  const [initialMessages] = useState(
    () => session.messages as unknown as Message[],
  );
  const { messages, submit, status, abort, interrupt, error } = useChat(
    session.id,
    initialMessages,
  );
  const { isTopLayer } = useKeyboardLayer();
  const { mode, model } = usePromptConfig();

  const hasSubmittedInitialPromptRef = useRef(false);

  useEffect(() => {
    return () => void abort();
  }, [abort]);

  useKeyboard((key) => {
    if (key.name === "escape" && isTopLayer("base") && status === "streaming") {
      key.preventDefault();
      interrupt();
    }
  });

  useEffect(() => {
    if (!initialPrompt || hasSubmittedInitialPromptRef.current) return;

    hasSubmittedInitialPromptRef.current = true;
    void submit({
      userText: initialPrompt.message,
      mode: initialPrompt.mode,
      model: initialPrompt.model,
    });
  }, [initialPrompt, submit]);

  return (
    <SessionShell
      onSubmit={(text) => submit({ userText: text, mode, model })}
      loading={status === "streaming"}
      interruptable={status === "streaming"}
    >
      {messages.map((m, i) => (
        <ChatMessage key={i} msg={m} />
      ))}
      {error && <ErrorMessage message={error.message} />}
    </SessionShell>
  );
}

const Session = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();

  const prefetched = useMemo(() => {
    const parsed = sessionLocationSchema.safeParse(location.state);
    return parsed.success ? parsed.data : null;
  }, [location.state]);

  const [session, setSession] = useState<SessionData | null>(
    prefetched?.session ?? null,
  );

  useEffect(() => {
    if (prefetched?.session) return;

    setSession(null);
    if (!id) return;

    let ignore = false;

    const fetchSession = async () => {
      try {
        const res = await apiClient.sessions[":id"].$get({
          param: { id },
        });
        if (ignore) return;
        if (!res.ok) throw new Error(await getErrorMessage(res));
        const session = await res.json();
        setSession(session);
      } catch (error) {
        if (ignore) return;
        toast.show({
          variant: "error",
          message:
            error instanceof Error ? error.message : "Failed to fetch session",
        });
        navigate("/");
      }
    };

    fetchSession();

    return () => {
      ignore = true;
    };
  }, [id, navigate, prefetched, toast]);

  if (!session)
    return <SessionShell onSubmit={() => {}} inputDisabled loading />;

  return (
    <SessionChat
      key={session.id}
      session={session}
      initialPrompt={prefetched?.initialPrompt}
    />
  );
};

export default Session;
