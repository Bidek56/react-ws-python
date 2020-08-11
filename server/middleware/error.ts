import { isHttpError, Status, Context } from "../deps.ts";

const between = (value: number, start: number, end: number) => value >= start && value < end;

export default async (ctx: Context, next: () => Promise<void>) => {
  try {
    await next();

    const status = ctx.response.status || Status.NotFound;

    if (status === Status.NotFound) {
      ctx.throw(Status.NotFound, "Not Found!");
    }
  } catch (err) {
    if (isHttpError(err)) {
      const status = err.status;

      ctx.response.status = status;
      ctx.response.type = "json";
      ctx.response.body = {
        status: between(status, 400, 500) ? "fail" : "error",
        message: err.message,
      };
    }
  }
};