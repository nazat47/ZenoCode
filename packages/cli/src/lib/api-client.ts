import type { AppType } from "@zenocode/server";
import { hc } from "hono/client";

export const apiClient = hc<AppType>(
  process.env.API_URL ?? "http://localhost:4000",
);
