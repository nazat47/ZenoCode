import { ScrollBoxRenderable, TextAttributes, type ScrollBarRenderable } from '@opentui/core'
import type { RefObject } from 'react'
import { getFilteredCommands } from './filter.commands'
import { COMMMANDS } from './commands'

const MAX_VISIBLE_ITEMS = 8

const COMMAND_COL_WIDTH = Math.max(...COMMMANDS.map(c => c.name.length)) + 4

type CommandMenuProps = {
    query: string,
    selectedIndex: number;
    scrollRef: RefObject<ScrollBoxRenderable | null>
    onSelect: (index: number) => void
    onExecute: (index: number) => void
}

export function CommandMenu({
    query,
    selectedIndex,
    scrollRef,
    onSelect,
    onExecute
}: CommandMenuProps) {
    const filtered = getFilteredCommands(query)
    const visibleHeight = Math.min(MAX_VISIBLE_ITEMS, filtered.length)

    if (filtered.length === 0) {
        return (
            <box paddingX={1}>
                <text attributes={TextAttributes.DIM}>No matching commands</text>
            </box>
        )
    }

    return (
        <scrollbox ref={scrollRef} height={visibleHeight}>
            {filtered.map((cmd, i) => {
                const isSelected = i === selectedIndex
                return (
                    <box
                        key={cmd.value}
                        flexDirection='row'
                        paddingX={1}
                        height={1}
                        overflow='hidden'
                        backgroundColor={isSelected ? "#89B4BA" : undefined}
                        onMouseMove={() => onSelect(i)}
                        onMouseDown={() => onExecute(i)}
                    >
                        <box width={COMMAND_COL_WIDTH} flexShrink={0}>
                            <text selectable={false} fg={isSelected ? "black" : "white"}>
                                {cmd.name}
                            </text>
                        </box>
                        <box flexGrow={1} flexShrink={1} overflow='hidden'>
                            <text selectable={false} fg={isSelected ? "black" : "gray"}>
                                {cmd.description}
                            </text>
                        </box>
                    </box>
                )
            })}
        </scrollbox>
    )
}