import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import sessions from "./routes/sessions";

const app = new Hono();

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json(
      {
        error: error.message || "Request faiiled",
      },
      error.status,
    );
  }

  console.error("Unhandle server error", error);
  return c.json({ error: "Internal Server Error" }, 500);
});

const routes = app.route("/sessions", sessions);

export type AppType = typeof routes;

export default {
  port: 4000,
  fetch: app.fetch,
  idleTimeout: 255,
};
