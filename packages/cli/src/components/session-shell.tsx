import type { ReactNode } from "react";
import { InputBar } from "./input-bar";
import { TextAttributes } from "@opentui/core";
import Spinner from "./spinner";

type Props = {
  children?: ReactNode;
  onSubmit: (text: string) => void;
  inputDisabled?: boolean;
  loading?: boolean;
};

const SessionShell = ({
  children,
  onSubmit,
  inputDisabled,
  loading,
}: Props) => {
  return (
    <box
      flexDirection="column"
      flexGrow={1}
      width={"100%"}
      height={"100%"}
      paddingY={1}
      paddingX={2}
      gap={1}
    >
      <scrollbox flexGrow={1} width={"100%"} stickyScroll stickyStart="bottom">
        <box gap={1}>{children}</box>
      </scrollbox>
      <box flexShrink={0}>
        <InputBar onSubmit={onSubmit} disabled={inputDisabled} />
      </box>
      <box
        flexDirection="row"
        flexShrink={0}
        justifyContent="space-between"
        width={"100%"}
        height={1}
        paddingLeft={1}
        gap={2}
      >
        <box flexDirection="row" alignItems="center" gap={2}>
          {loading ? <Spinner /> : null}
        </box>
        <box flexDirection="row" alignItems="center" gap={2}>
          <text>tab</text>
          <text attributes={TextAttributes.DIM}>agents</text>
        </box>
      </box>
    </box>
  );
};

export default SessionShell;
