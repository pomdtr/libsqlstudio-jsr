import * as embedder from "jsr:@nfnitloop/deno-embedder";

const options = {
  importMeta: import.meta,

  mappings: [
    {
      sourceDir: "frontend/dist",
      destDir: "embed/dist",
    },
  ],
};

if (import.meta.main) {
  await embedder.main({ options });
}
