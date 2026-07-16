import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import sessions from "./routes/sessions";
import chat from "./routes/chat";
import { sentry } from "@sentry/hono/bun";
import * as Sentry from "@sentry/hono/bun";

const app = new Hono();

app.use(
  sentry(app, {
    dsn: "https://e18fbe09317355ffdabcfada64d9fac0@o4511736512643072.ingest.us.sentry.io/4511736520376320",
    tracesSampleRate: 1.0,
    enableLogs: true,
    sendDefaultPii: true,
  }),
);

app.get("/debug-sentry", () => {
  Sentry.metrics.count("test_counter", 1);
  throw new Error("My first Sentry error!");
});

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    Sentry.logger.warn("handled http error", {
      path: c.req.path,
      method: c.req.method,
      status: error.status,
      message: error.message || "request failed",
    });
    return c.json(
      {
        error: error.message || "Request faiiled",
      },
      error.status,
    );
  }

  Sentry.logger.error("Unhandled server error", {
    path: c.req.path,
    method: c.req.method,
    message: "Internal server error",
  });
  return c.json({ error: "Internal Server Error" }, 500);
});

const routes = app.route("/sessions", sessions).route("/chat", chat);

export type AppType = typeof routes;

export default {
  port: 4000,
  fetch: app.fetch,
  idleTimeout: 255,
};
