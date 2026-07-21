import { Polar } from "@polar-sh/sdk";

type PolarSever = "sandbox" | "production";

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Polar env ${name} is not set`);
  }
  return value;
}

export function getPolarAccessToken(): string {
  return getRequiredEnv("POLAR_ACCESS_TOKEN");
}

export function getPolarProductId(): string {
  return getRequiredEnv("POLAR_PRODUCT_ID");
}

export function getPolarCreditsMeterId() {
  return getRequiredEnv("POLAR_CREDITS_METER_ID");
}

export function getPolarServer(): PolarSever {
  const server = process.env.POLAR_SERVER;
  if (!server) {
    return "sandbox";
  }

  if (server !== "sandbox" && server !== "production") {
    throw new Error("polar server must be either production or sandbox");
  }

  return server;
}

const polar = new Polar({
  accessToken: getPolarAccessToken(),
  server: getPolarServer(),
});

function hasStatusCode(error: unknown): error is { statusCode: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  );
}

type CreateCheckoutUrlParams = {
  customerExternalId: string;
  requestUrl: string;
};

export async function createCheckoutUrl({
  customerExternalId,
  requestUrl,
}: CreateCheckoutUrlParams) {
  const result = await polar.checkouts.create({
    products: [getPolarProductId()],
    successUrl: new URL("/billing/success", requestUrl).toString(),
    externalCustomerId: customerExternalId,
    metadata: { source: "zenocode-cli" },
  });

  return result.url;
}

export async function createCustomerPortalUrl({
  customerExternalId,
  requestUrl,
}: CreateCheckoutUrlParams) {
  const result = await polar.customerSessions.create({
    returnUrl: new URL("/billing/success", requestUrl).toString(),
    externalCustomerId: customerExternalId,
  });

  return result.customerPortalUrl;
}

export async function getAvailableCreditsBalance(customerExternalId: string) {
  try {
    const customerState = await polar.customers.getStateExternal({
      externalId: customerExternalId,
    });

    const matchingMeters = customerState.activeMeters.filter(
      (meter) => meter.meterId === getPolarCreditsMeterId(),
    );

    if (matchingMeters.length > 1) {
      throw new Error("Expected exactly one matching meter");
    }

    const creditsMeter = matchingMeters[0];
    return creditsMeter?.balance ?? 0;
  } catch (error) {
    if (hasStatusCode(error) && error.statusCode === 401) {
      return 0;
    }

    throw error;
  }
}

type IngestAIUsageParams = {
  credits: number;
  eventId: string;
  externalCustomerId: string;
};

export async function IngestAIUsage({
  eventId,
  credits,
  externalCustomerId,
}: IngestAIUsageParams) {
  if (credits <= 0) {
    return;
  }

  await polar.events.ingest({
    events: [
      {
        name: "zenocode_usage",
        externalId: eventId,
        externalCustomerId,
        metadata: { credits },
      },
    ],
  });
}
