import {
  DEFAULT_CHAT_MODEL_ID,
  type SupportedChatModelId,
  type ModeType,
  Mode,
} from "@zenocode/shared";
import { createContext, useCallback, useContext, useState } from "react";

type PromptConfigContextValue = {
  mode: ModeType;
  model: SupportedChatModelId;
  setMode: (mode: ModeType) => void;
  setModel: (mode: SupportedChatModelId) => void;
  toggleMode: () => void;
};

const PromptConfigContext = createContext<PromptConfigContextValue | null>(
  null,
);

export const usePromptConfig = () => {
  const context = useContext(PromptConfigContext);
  if (!context) {
    throw new Error(
      "usePromptConfig must be used within a PromptConfigProvider",
    );
  }
  return context;
};

export const PromptConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [model, setModel] = useState<SupportedChatModelId>(
    DEFAULT_CHAT_MODEL_ID,
  );
  const [mode, setMode] = useState<ModeType>(Mode.BUILD);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === Mode.BUILD ? Mode.PLAN : Mode.BUILD));
  }, []);

  return (
    <PromptConfigContext.Provider
      value={{ model, mode, setModel, setMode, toggleMode }}
    >
      {children}
    </PromptConfigContext.Provider>
  );
};
