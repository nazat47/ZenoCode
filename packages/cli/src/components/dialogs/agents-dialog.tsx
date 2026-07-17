import { useCallback } from "react";
import { useDialog } from "../../providers/dialog";
import DialogSearchList from "../dialog-search-list";
import { Mode } from "@zenocode/database/enums";

const AVAILABLE_MODES = [Mode.PLAN, Mode.BUILD];

type AgentsDialogContentProps = {
  currentMode: Mode;
  onSelectMode: (mode: Mode) => void;
};

function getModeLabel(mode: Mode) {
  return mode === Mode.PLAN ? "Plan" : "Build";
}

export const AgentsDialogContent = ({
  currentMode,
  onSelectMode,
}: AgentsDialogContentProps) => {
  const dialog = useDialog();

  const handleSelect = useCallback(
    (nextMode: Mode) => {
      onSelectMode(nextMode);
      dialog.close();
    },
    [dialog, onSelectMode],
  );

  return (
    <DialogSearchList
      items={AVAILABLE_MODES}
      onSelect={handleSelect}
      filterFn={(t, query) =>
        getModeLabel(t).toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(mode, isSelected) => (
        <text selectable={false} fg={isSelected ? "black" : "white"}>
          {mode === currentMode ? "[✓]" : ""} {getModeLabel(mode)}
        </text>
      )}
      getKey={(t) => t}
      placeHolder="Search modes"
      emptyText="No matching modes."
    />
  );
};
