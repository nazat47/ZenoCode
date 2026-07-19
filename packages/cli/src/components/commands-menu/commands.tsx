import { SUPPORTED_CHAT_MODELS } from "@zenocode/shared";
import {
  AgentsDialogContent,
  ModelsDialogContent,
  SessionDialogContent,
  ThemeDialogContent,
} from "../dialogs";
import type { Command, CommandContext } from "./types";
import { performLogin } from "../../lib/oauth";
import { clearAuth } from "../../lib/auth";

export const COMMMANDS: Command[] = [
  {
    name: "new",
    description: "Start a new conversation",
    value: "/new",
    action: (ctx) => {
      ctx.navigate("/");
    },
  },
  {
    name: "sessions",
    description: "Show recent conversations",
    value: "/sessions",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select sessions",
        children: <SessionDialogContent />,
      });
    },
  },
  {
    name: "models",
    description: "Switch between LLM models",
    value: "/models",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select Model",
        children: (
          <ModelsDialogContent
            models={SUPPORTED_CHAT_MODELS.map((model) => model.id)}
            onSelectModel={ctx.setModel}
          />
        ),
      });
    },
  },
  {
    name: "agents",
    description: "Switch agents",
    value: "/agents",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select agents",
        children: (
          <AgentsDialogContent
            currentMode={ctx.mode}
            onSelectMode={ctx.setMode}
          />
        ),
      });
    },
  },
  {
    name: "theme",
    description: "Switch theme",
    value: "/theme",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select theme",
        children: <ThemeDialogContent />,
      });
    },
  },
  {
    name: "login",
    description: "Login to your account",
    value: "/login",
    action: async (ctx) => {
      ctx.toast.show({ message: "Opening browser to login" });
      try {
        await performLogin();
        ctx.toast.show({ variant: "success", message: "Signed in" });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Sign in failed";

        ctx.toast.show({ variant: "error", message });
      }
    },
  },
  {
    name: "upgrade",
    description: "Buy more credits",
    value: "/upgrade",
    action: (ctx) => {
      ctx.toast.show({ message: "Opening upgrade portal" });
    },
  },
  {
    name: "usage",
    description: "Open billing portal in your browser",
    value: "/usage",
    action: (ctx) => {
      ctx.toast.show({ message: "Opening billing portal" });
    },
  },
  {
    name: "logout",
    description: "Sign out of your account",
    value: "/logout",
    action: (ctx) => {
      clearAuth();
      ctx.toast.show({ message: "Logging out" });
    },
  },
  {
    name: "exit",
    description: "Quite the application",
    value: "/exit",
    action: (ctx: CommandContext) => {
      ctx.exit();
    },
  },
];
