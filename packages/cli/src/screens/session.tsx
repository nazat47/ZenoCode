import type { InferResponseType } from "hono";
import SessionShell from "../components/session-shell";
import { apiClient } from "../lib/api-client";
import z from "zod";
import { BotMessage, ErrorMessage, UserMessage } from "../components/message";
import { useLocation, useNavigate, useParams } from "react-router";
import { useToast } from "../providers/toast";
import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../lib/http-errors";
import { useChat, type Message } from "../hooks/use-chat";
import {
  DEFAULT_CHAT_MODEL_ID,
  type SupportedChatModelId,
} from "@zenocode/shared";
import prettyMs from "pretty-ms";
import { MessageStatus } from "@zenocode/database/enums";
import { useKeyboardLayer } from "../providers/keyboard-layer";
import { useKeyboard } from "@opentui/react";

type SessionData = InferResponseType<
  (typeof apiClient.sessions)[":id"]["$get"],
  200
>;

const sessionLocationSchema = z.object({
  session: z.custom<SessionData>(
    (val) => val !== null && typeof val === "object" && "id" in val,
  ),
});

function mapDBMessages(dbMessages: SessionData["messages"]): Message[] {
  return dbMessages.map((m) => {
    if (m.role === "ERROR") {
      return { id: m.id, role: "error", content: m.content };
    }

    if (m.role === "USER") {
      return {
        id: m.id,
        role: "user",
        content: m.content,
        mode: m.mode,
        model: m.model as SupportedChatModelId,
      };
    }

    return {
      id: m.id,
      role: "assistant",
      content: m.content,
      model: m.model as SupportedChatModelId,
      mode: m.mode,
      parts: [{ type: "text", text: m.content }],
      ...(m.duration !== null ? { duration: prettyMs(m.duration * 1000) } : {}),
      interrupted: m.status === MessageStatus.INTERRUPTED,
    };
  });
}

function ChatMessage({ msg }: { msg: Message }) {
  if (msg.role === "user") {
    return <UserMessage message={msg.content} />;
  }

  if (msg.role === "error") {
    return <ErrorMessage message={msg.content} />;
  }
  return (
    <BotMessage
      mode={msg.mode}
      duration={msg.duration}
      streaming={false}
      parts={msg.parts}
      model={msg.model}
      interrupted={msg.interrupted}
    />
  );
}

function SessionChat({ session }: { session: SessionData }) {
  const [initialMessages] = useState(() => mapDBMessages(session.messages));
  const { messages, streaming, submit, abort, interrupt } = useChat(
    session.id,
    initialMessages,
  );
  const { isTopLayer } = useKeyboardLayer();

  useEffect(() => {
    return () => abort();
  }, [abort]);

  useKeyboard((key) => {
    if (
      key.name === "escape" &&
      isTopLayer("base") &&
      streaming.status === "streaming"
    ) {
      key.preventDefault();
      interrupt();
    }
  });

  return (
    <SessionShell
      onSubmit={(text) =>
        submit({ userText: text, mode: "BUILD", model: DEFAULT_CHAT_MODEL_ID })
      }
      loading={streaming.status === "streaming"}
      interruptable={streaming.status === "streaming"}
    >
      {messages.map((m, i) => (
        <ChatMessage key={i} msg={m} />
      ))}
      {streaming.status === "streaming" && streaming.parts.length > 0 && (
        <BotMessage
          mode={streaming.mode}
          model={streaming.model}
          parts={streaming.parts}
          streaming
        />
      )}
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
    return parsed.success ? parsed.data.session : null;
  }, [location.state]);

  const [session, setSession] = useState<SessionData | null>(prefetched);

  useEffect(() => {
    if (prefetched) return;

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

  return <SessionChat key={session.id} session={session} />;
};

export default Session;
