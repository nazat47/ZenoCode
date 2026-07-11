import { TextareaRenderable, type KeyBinding } from "@opentui/core";
import { StatusBar } from "./status-bar";
import { useCallback, useEffect, useRef } from "react";
import { useRenderer } from "@opentui/react";
import { useCommandMenu } from "./commands-menu/use-command-menu";
import type { Command } from "./commands-menu/types";
import { CommandMenu } from "./commands-menu";

type Props = {
  onSubmit: (text: string) => void;
  disabled?: boolean;
};

export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  { name: "return", action: "submit" },
  { name: "enter", action: "submit" },
  { name: "return", shift: true, action: "newline" },
  { name: "enter", shift: true, action: "newline" },
];

export function InputBar({ onSubmit, disabled = false }: Props) {
  const textareaRef = useRef<TextareaRenderable>(null);
  const onSubmitRef = useRef<() => void>(() => {});
  const renderer = useRenderer();
  const {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  } = useCommandMenu();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.onSubmit = () => {
      onSubmitRef.current();
    };
  }, []);

  onSubmitRef.current = () => {
    if (disabled) return;
    if (showCommandMenu) {
      const command = resolveCommand(selectedIndex);
      handleCommand(command);
      return;
    }
    handleSubmit();
  };

  const handleCommand = useCallback(
    (command: Command | undefined) => {
      const text = textareaRef.current;
      if (!text || !command) return;

      text.setText("");

      if (command.action) {
        command.action({
          exit: () => renderer.destroy(),
        });
      } else {
        text.insertText(command.value + " ");
      }
    },
    [renderer],
  );

  const handleSubmit = useCallback(() => {
    if (disabled) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.plainText.trim();

    if (text.length === 0) return;

    onSubmit(text);
    textarea.setText("");
  }, [onSubmit, disabled]);

  const handleTextareaContentChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    handleContentChange(textarea.plainText);
  }, []);

  const handleCommandExecute = useCallback((index: number) => {
    const command = resolveCommand(index);
    handleCommand(command);
  }, []);

  return (
    <box width={"100%"} alignItems="center" paddingX={2}>
      <box width={"100%"} border={["left"]} borderColor={"cyan"}>
        <box
          position="relative"
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor={"#1A1A24"}
          width={"100%"}
          gap={1}
        >
          {showCommandMenu && (
            <box
              position="absolute"
              bottom={"100%"}
              left={0}
              width={"100%"}
              backgroundColor={"#1A1A24"}
              zIndex={10}
            >
              <CommandMenu
                query={commandQuery}
                selectedIndex={selectedIndex}
                scrollRef={scrollRef}
                onSelect={setSelectedIndex}
                onExecute={handleCommandExecute}
              />
            </box>
          )}
          <textarea
            ref={textareaRef}
            onContentChange={handleTextareaContentChange}
            keyBindings={TEXTAREA_KEY_BINDINGS}
            focused={!disabled}
            placeholder={'Ask anything.."Fix a bug in the code"'}
          />
          <StatusBar />
        </box>
      </box>
    </box>
  );
}
