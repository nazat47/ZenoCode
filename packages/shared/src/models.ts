export type ModelPricing = {
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
};

export type SupportedProvider = "anthropic" | "openai";

type SupportedChatModelDefinition = {
  id: string;
  provider: SupportedProvider;
  pricing: ModelPricing;
};

export const SUPPORTED_CHAT_MODELS = [
  {
    id: "claude-sonnet-4-6",
    provider: "anthropic",
    pricing: {
      inputUsdPerMillionTokens: 3,
      outputUsdPerMillionTokens: 15,
    },
  },
  {
    id: "claude-opus-4-6",
    provider: "anthropic",
    pricing: {
      inputUsdPerMillionTokens: 5,
      outputUsdPerMillionTokens: 25,
    },
  },
  {
    id: "gpt-5-nano",
    provider: "openai",
    pricing: {
      inputUsdPerMillionTokens: 0.16,
      outputUsdPerMillionTokens: 2.25,
    },
  },

  {
    id: "gpt-5.4-mini",
    provider: "openai",
    pricing: {
      inputUsdPerMillionTokens: 0.75,
      outputUsdPerMillionTokens: 4.5,
    },
  },
] as const satisfies readonly SupportedChatModelDefinition[];

export type SupportedChatModel = (typeof SUPPORTED_CHAT_MODELS)[number];

export type SupportedChatModelId = SupportedChatModel["id"];

export function findSupportedChatModel(id: string) {
  return SUPPORTED_CHAT_MODELS.find((model) => model.id === id);
}

export const DEFAULT_CHAT_MODEL_ID: SupportedChatModelId = "claude-sonnet-4-6";
