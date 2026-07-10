import type { Command, CommandContext } from "./types"

export const COMMMANDS: Command[] = [
    {
        name: "new",
        description: "Start a new conversation",
        value: "/new"
    },
    {
        name: "exit",
        description: "Quite the application",
        value: "/exit",
        action: (ctx: CommandContext) => {
            ctx.exit()
        }
    }
]