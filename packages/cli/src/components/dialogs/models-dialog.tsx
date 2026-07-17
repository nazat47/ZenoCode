import { useCallback } from "react";
import { useDialog } from "../../providers/dialog";
import DialogSearchList from "../dialog-search-list";
import type { SupportedChatModelId } from "@zenocode/shared";

type ModelsDialogContentProps = {
  models: SupportedChatModelId[];
  onSelectModel: (model: SupportedChatModelId) => void;
};

export const ModelsDialogContent = ({
  models,
  onSelectModel,
}: ModelsDialogContentProps) => {
  const dialog = useDialog();

  const handleSelect = useCallback(
    (model: SupportedChatModelId) => {
      onSelectModel(model);
      dialog.close();
    },
    [dialog, onSelectModel],
  );

  return (
    <DialogSearchList
      items={models}
      onSelect={handleSelect}
      filterFn={(modelId, query) =>
        modelId.toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(modelId, isSelected) => (
        <text selectable={false} fg={isSelected ? "black" : "white"}>
          {modelId}
        </text>
      )}
      getKey={(t) => t}
      placeHolder="Search models"
      emptyText="No matching models."
    />
  );
};
