export type ModelPricing = {
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
};

export type SupportedProvider = "anthropic" | "openai" | "google";

type SupportedChatModelDefinition = {
  id: string;
  provider: SupportedProvider;
  pricing: ModelPricing;
};

export const SUPPORTED_CHAT_MODELS = [
  {
    id: "gemini-3.5-flash",
    provider: "google",
    pricing: {
      inputUsdPerMillionTokens: 0.35,
      outputUsdPerMillionTokens: 1.75,
    },
  },
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
    id: "gpt-5.4",
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

export const DEFAULT_CHAT_MODEL_ID: SupportedChatModelId = "gemini-3.5-flash";
