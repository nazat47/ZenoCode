import { createMiddleware } from "hono/factory";
import { authenticateOAuthRequest } from "../lib/auth";

export type AuthenticatedEnv = {
  Variables: {
    userId: string;
  };
};

export const requiredAuth = createMiddleware<AuthenticatedEnv>(
  async (c, next) => {
    try {
      const auth = await authenticateOAuthRequest(c.req.raw);
      if (!auth) {
        return c.json({ error: "Unauthorized, login to continue" });
      }

      c.set("userId", auth.userId);

      await next();
    } catch (error) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  },
);
