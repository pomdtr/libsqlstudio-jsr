import { Hono } from "jsr:@hono/hono@4.4.7";
import { logger } from "jsr:@hono/hono@4.4.7/logger";
import { getMimeType } from "jsr:@hono/hono@4.4.7/utils/mime";
import dir from "./embed/dist/dir.ts";

export function createApp(options?: { token: string }): Hono {
  const token = options?.token || Deno.env.get("valtown");
  if (!token) {
    throw new Error("Missing token");
  }

  const app = new Hono();

  app.use("*", logger());

  app.post("/api/execute", async (c) => {
    return await fetch("https://api.val.town/v1/sqlite/execute", {
      method: "POST",
      body: c.req.raw.body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  app.post("/api/batch", async (c) => {
    return await fetch("https://api.val.town/v1/sqlite/batch", {
      method: "POST",
      body: c.req.raw.body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  app.get("*", async (c) => {
    let filepath = c.req.path;
    if (filepath.endsWith("/")) {
      filepath = "/index.html";
    }

    const mimeType = getMimeType(filepath);
    if (!mimeType) {
      return new Response("Not found", { status: 404 });
    }

    const file = await dir.get(filepath.slice(1));
    return new Response(await file?.bytes(), {
      headers: {
        "Content-Type": mimeType,
      },
    });
  });

  return app;
}
