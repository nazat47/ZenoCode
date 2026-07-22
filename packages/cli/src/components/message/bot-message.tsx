import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";
import type { Message } from "../../hooks/use-chat";
import { Mode, type ModeType } from "@zenocode/shared";
import prettyms from "pretty-ms";

type ClientMessagePart = Message["parts"][number];
type ToolPart = Extract<
  ClientMessagePart,
  { type: `tool-${string}` | "dynamic-tool" }
>;

function formatToolName(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function isToolPart(part: ClientMessagePart): part is ToolPart {
  return part.type.startsWith("tool-") || part.type === "dynamic-tool";
}

function formatToolArgs(tc: ToolPart): string {
  if (!("input" in tc) || tc.input === null) return "";
  if (typeof tc.input !== "object") return String(tc.input);
  return Object.values(tc.input).map(String).join(" ");
}

type PartGroup = {
  type: ClientMessagePart["type"];
  parts: ClientMessagePart[];
  key: string;
};

function groupConsecutiveParts(parts: ClientMessagePart[]): PartGroup[] {
  const groups: PartGroup[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.type === part.type) {
      lastGroup.parts.push(part);
    } else {
      const key = isToolPart(part)
        ? `group-tc-${part.toolCallId}`
        : `group-${part.type}-${i}`;
      groups.push({
        type: part.type,
        key,
        parts: [part],
      });
    }
  }
  return groups;
}

const BotMessage = ({
  parts,
  model,
  mode,
  duration,
  streaming = false,
}: {
  parts: ClientMessagePart[];
  model: string;
  mode: ModeType;
  duration?: number;
  streaming?: boolean;
}) => {
  const { colors } = useTheme();

  return (
    <box width={"100%"} alignItems="center">
      {groupConsecutiveParts(parts).map((grp, i) => (
        <box key={grp.key} width={"100%"} paddingTop={i === 0 ? 0 : 1}>
          {grp.parts.map((part, j) => {
            if (part.type === "reasoning") {
              return (
                <box
                  key={`reasoning-${j}`}
                  border={["left"]}
                  borderColor={colors.thinkingBorder}
                  width={"100%"}
                  paddingX={2}
                >
                  <text attributes={TextAttributes.DIM}>
                    <em fg={colors.thinking}>Thinking: </em> {part.text}
                  </text>
                </box>
              );
            }
            if (isToolPart(part)) {
              const toolName =
                part.type === "dynamic-tool"
                  ? part.toolName
                  : part.type.slice("tool-".length);
              return (
                <box
                  key={part.toolCallId}
                  border={["left"]}
                  borderColor={colors.thinkingBorder}
                  width={"100%"}
                  paddingX={2}
                >
                  <text attributes={TextAttributes.DIM}>
                    <em fg={colors.info}>{formatToolName(toolName)}:</em>{" "}
                    {formatToolArgs(part)}
                    {part.state !== "output-available" &&
                    part.state !== "output-error"
                      ? "..."
                      : ""}
                    {part.state === "output-error" ? `${part.errorText}` : ""}
                  </text>
                </box>
              );
            }

            if (part.type === "text") {
              return (
                <box key={`text-${j}`} width={"100%"} paddingX={3}>
                  <text>{part.text}</text>
                </box>
              );
            }

            return null;
          })}
        </box>
      ))}
      <box paddingX={3} paddingY={1} gap={1} width={"100%"}>
        <box flexDirection="row" gap={2}>
          <text fg={mode === Mode.PLAN ? colors.planMode : colors.primary}>
            .
          </text>
          <box flexDirection={"row"} gap={1}>
            <text>{mode === Mode.PLAN ? "Plan" : "Build"}</text>
            <text attributes={TextAttributes.DIM} fg={colors.dimSeperator}>
              {">"}
            </text>
            <text attributes={TextAttributes.DIM}>{model}</text>
            {duration != null && (
              <>
                <text attributes={TextAttributes.DIM} fg={colors.dimSeperator}>
                  {">"}
                </text>
                <text attributes={TextAttributes.DIM}>
                  {prettyms(duration)}
                </text>
              </>
            )}
          </box>
        </box>
      </box>
    </box>
  );
};

export { BotMessage };
