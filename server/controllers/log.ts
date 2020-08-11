import { Status, RouterContext } from "../deps.ts";

export const log = async (ctx: RouterContext) => {

    const decoder = new TextDecoder("utf-8")

    try {
        if (!ctx.request.hasBody) {
            if (ctx.throw)
                ctx.throw(Status.BadRequest, "Bad request");
            else {
                ctx.response.status = Status.OK;
                ctx.response.body = { 'error': "Bad log request" };
                ctx.response.type = "json";
                return
            }
        }
        const body = await ctx.request.body();

        let value: object | null = null;

        if (body.type === "json") {
            value = await body?.value;
        }

        if (value && 'path' in value) {

            // console.log("Deno.readFileSync:", value["path"])

            // const content = decoder.decode(Deno.readFileSync(value["path"]));
            const content = "meow"
            // ctx.assert(!content, Status.BadRequest);

            ctx.response.status = Status.OK;
            ctx.response.body = { 'content': content };
            ctx.response.type = "json";
            return;
        }
    } catch (error) {
        if (ctx.throw)
            ctx.throw(Status.InternalServerError, error);
        else
            console.error(error);            
    }
}