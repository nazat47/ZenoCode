export type CommandContext = {
    exit: () => void
}

export type Command = {
    name: string
    value: string
    description: string
    action?: (ctx: CommandContext) => void | Promise<void>
}