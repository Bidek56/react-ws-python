import { DenonConfig } from "https://deno.land/x/denon/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run server.ts",
      desc: "run my app.ts file",
    "allow": [
      "net",
      "write",
      "env"
    ],
  },
  },
};

export default config;