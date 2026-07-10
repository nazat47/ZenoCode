import { COMMMANDS } from "./commands";
import type { Command } from "./types";

export function getFilteredCommands(query: string): Command[] {
    if (query.length === 0) return COMMMANDS
    return COMMMANDS.filter(c => c.name.toLowerCase().startsWith(query.toLowerCase()))
}