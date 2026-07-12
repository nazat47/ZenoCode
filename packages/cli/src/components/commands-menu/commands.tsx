import { ThemeDialogContent } from "../dialogs";
import type { Command, CommandContext } from "./types";

export const COMMMANDS: Command[] = [
  {
    name: "new",
    description: "Start a new conversation",
    value: "/new",
    action: (ctx) => {
      ctx.toast.show({ message: "Starting a new conversation" });
    },
  },
  {
    name: "sessions",
    description: "Show recent conversations",
    value: "/sessions",
    action: (ctx) => {
      ctx.toast.show({ message: "Showing recent conversations" });
    },
  },
  {
    name: "models",
    description: "Switch between LLM models",
    value: "/models",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select Model",
        children: <text>Model selection coming soon...</text>,
      });
    },
  },
  {
    name: "agents",
    description: "Switch agents",
    value: "/agents",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select mode",
        children: <text>Agent selection coming soon...</text>,
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
