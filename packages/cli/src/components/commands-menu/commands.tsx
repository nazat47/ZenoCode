import type { Command, CommandContext } from "./types";

export const COMMMANDS: Command[] = [
  {
    name: "new",
    description: "Start a new conversation",
    value: "/new",
  },
  {
    name: "sessions",
    description: "Show recent conversations",
    value: "/sessions",
  },
  {
    name: "models",
    description: "Switch between LLM models",
    value: "/models",
  },
  {
    name: "agents",
    description: "Switch agents",
    value: "/agents",
  },
  {
    name: "login",
    description: "Login to your account",
    value: "/login",
  },
  {
    name: "theme",
    description: "Change color theme",
    value: "/theme",
  },
  {
    name: "upgrade",
    description: "Buy more credits",
    value: "/upgrade",
  },
  {
    name: "usage",
    description: "Open billing portal in your browser",
    value: "/usage",
  },
  {
    name: "logout",
    description: "Sign out of your account",
    value: "/logout",
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
