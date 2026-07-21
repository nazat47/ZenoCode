import {
  findSupportedChatModel,
  SUPPORTED_CHAT_MODELS,
  type ModelPricing,
} from "@zenocode/shared";
import type { LanguageModelUsage } from "ai";

type CalculateCreditsForUsageParams = {
  provider: string;
  model: string;
  usage: LanguageModelUsage;
};

type BillableUsage = {
  credits: number;
};

type TokenCounts = {
  inputTokens: number;
  outputTokens: number;
};

const TOKENS_PER_MILLION = 1000000;

const USD_PER_CREDIT = 0.01;

function getTokenCounts(usage: LanguageModelUsage): TokenCounts {
  const inputTokens = usage.inputTokens;
  const outputTokens = usage.outputTokens;
  if (!inputTokens || !outputTokens) {
    throw new Error("credit conversion requires input and output token counts");
  }

  return {
    inputTokens,
    outputTokens,
  };
}

function getModelPricing(provider: string, model: string): ModelPricing {
  const supportedModel = findSupportedChatModel(model);

  if (!supportedModel || supportedModel.provider !== provider) {
    if (!SUPPORTED_CHAT_MODELS.some((m) => m.provider === provider)) {
      throw new Error(`Unsupported chat provider: ${provider}`);
    }

    throw new Error(
      `Model ${model} not found or not supported for provider ${provider}`,
    );
  }

  return supportedModel.pricing;
}

function estimateCostUSD(
  { inputTokens, outputTokens }: TokenCounts,
  pricing: ModelPricing,
) {
  return (
    (inputTokens * pricing.inputUsdPerMillionTokens +
      outputTokens * pricing.outputUsdPerMillionTokens) /
    TOKENS_PER_MILLION
  );
}

function convertUSDToCredits(estimateCostUSD: number) {
  if (estimateCostUSD <= 0) return 0;

  return Math.max(1, Math.ceil(estimateCostUSD / USD_PER_CREDIT));
}

export function calculateCreditsForUsage({
  provider,
  model,
  usage,
}: CalculateCreditsForUsageParams): BillableUsage {
  const tokenCounts = getTokenCounts(usage);
  const pricing = getModelPricing(provider, model);
  const costUSD = estimateCostUSD(tokenCounts, pricing);
  const credits = convertUSDToCredits(costUSD);

  return { credits };
}
