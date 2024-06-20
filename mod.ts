import { Hono } from "jsr:@hono/hono@4.4.7";
import { getMimeType } from "jsr:@hono/hono@4.4.7/utils/mime";
import dir from "./embed/dist/dir.ts";

export function createApp(credentials: {
  url: string;
  authToken: string;
}): Hono {
  const app = new Hono();

  app.get("/api/credentials", (c) => {
    return c.json(credentials);
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
