import { Status, RouterContext, validateJwt, Jose, Payload } from "../deps.ts";

type JwtObject = { header: Jose; payload?: Payload; signature: string }

export default async (ctx: RouterContext, next: () => Promise<void>) => {
  const serverToken = ctx?.cookies?.get("server-token")

  if (!serverToken) {
    if (ctx.throw)
      ctx.throw(Status.Unauthorized, "Access Token Missing!");
    else {
      // console.error("Access Token Missing!");
      await next();
    }
  } else {
    try {
      const key: string = Deno.env.get("TOKEN_SECRET") || "H3EgqdTJ1SqtOekMQXxwufbo2iPpu89O";

      const jwtObject: JwtObject|null = await validateJwt(serverToken, key);

      // console.log("jwtObject:",  jwtObject)
      // ctx.request.user = jwtObject?.payload;

      await next();
    } catch (err) {
      if (ctx.throw)
        ctx.throw(Status.Unauthorized);
      else
        console.error(err);
    }
  }
};