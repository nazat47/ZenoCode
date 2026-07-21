import { createMiddleware } from "hono/factory";
import type { AuthenticatedEnv } from "./require-auth";
import { getAvailableCreditsBalance } from "../lib/polar";

export const requireCredits = createMiddleware<AuthenticatedEnv>(
  async (c, next) => {
    try {
      const userId = c.get("userId");
      const creditsBalance = await getAvailableCreditsBalance(userId);

      if (creditsBalance <= 0) {
        return c.json({
          error: "No credits remaining, run /upgrade to buy more credits",
        });
      }

      await next();
    } catch (error) {
      console.log(error);
      return c.json(
        { error: "Unable to verify credits balance, please try again later" },
        503,
      );
    }
  },
);
