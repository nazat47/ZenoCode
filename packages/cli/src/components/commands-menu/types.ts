import type { DialogContextValue } from "../../providers/dialog";
import type { ToastContextValue } from "../../providers/toast";

export type CommandContext = {
  exit: () => void;
  toast: ToastContextValue;
  dialog: DialogContextValue;
};

export type Command = {
  name: string;
  value: string;
  description: string;
  action?: (ctx: CommandContext) => void | Promise<void>;
};
