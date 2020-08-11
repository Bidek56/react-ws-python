// Importing Modules
import { Application, oakCors } from "./deps.ts";
import error from "./middleware/error.ts";
import logger from "./middleware/logger.ts";
import timer from "./middleware/timer.ts";
// import home from "./src/routes/home.tsx";
import auth from "./routes/auth.ts";
import log from "./routes/log.ts"

const server = new Application();
server.use(
    oakCors({
      origin: /^.+localhost:(3000|1234)$/,
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    }),
  );
server.use(error);
server.use(logger);
server.use(timer);

server.use(auth.routes())
    .use(log.routes());

server.addEventListener("error", (evt) => {
    // Will log the thrown error to the console.
    console.log("error:", evt.error);
});

// start server
console.log("React SSR App listening on port 8000");
await server.listen({ port: 8000 });