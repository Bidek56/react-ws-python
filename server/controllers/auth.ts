import { Status, verify, makeJwt, Jose, Payload, RouterContext, Body } from "../deps.ts";

type LoginBody = Promise<any> & { user?: string, pass?: string }

export const login = async(ctx: RouterContext) => {

    try {

        if (!ctx.request.hasBody) {
            ctx.throw(Status.BadRequest, "Bad Request");
        }

        const body: Body = ctx.request.body();
        
        // console.log(body)

        let value: LoginBody | null = null;

        if (body?.type === 'json') {
            value = await body?.value;
        } else {
            ctx.throw(Status.UnprocessableEntity, "Wrong body type");
        }

        const user = value?.user;

        if (!value || !user) {
            ctx.throw(Status.UnprocessableEntity, "Wrong user name");
        } else if (value?.pass && await verify(value?.pass, "c2NyeXB0AA4AAAAIAAAAAQVR+9n5QXXXutDKrHp70j9oQA200hKYVM6RDl2UrgTSLfl5DBkEtx6r73se5iAxpQ7Eh89S5Q6nsd7O1rGdZqBcXQIQTcTFnJlmCpsx5qUp")) {
            const header: Jose = { alg: "HS256", typ: "JWT" };
            const payload: Payload = {
                id: user,
                name: user
            };
            const key: string = Deno.env.get("TOKEN_SECRET") || "H3EgqdTJ1SqtOekMQXxwufbo2iPpu89O";

            const token = makeJwt({ header, payload, key });

            ctx.response.status = Status.OK;
            ctx.response.type = "json";
            ctx.response.body = {
                status: "success",
                message: `Logged in with ${value?.user}`,
                data: { accessToken: token },
            };
        } else {
            ctx.throw(Status.Unauthorized, "Wrong Password!");
        }

    } catch (error) {
		console.log("catch:", error);
    }
}

export async function logout(ctx: RouterContext) {

    try {

        if (!ctx.request.hasBody) {
            ctx.throw(Status.BadRequest, "Bad Request");
        }

        const body: any = await ctx.request.body();
        const value: {token: string} | undefined = await body?.value

        if (!value?.token) {
            ctx.throw(Status.UnprocessableEntity, "Token not found");
        } else {
            ctx.cookies.delete("server-token")
        }

    } catch (error) {
        console.log("catch:", error);
    }
}

export const token = async (ctx: RouterContext) => {

    try {
        ctx.response.status = Status.OK;
        ctx.response.type = "json";

        console.log("Cookies:", ctx?.cookies)

        if (ctx?.cookies?.get("server-token")) {            
            ctx.response.body = { 'token': ctx.cookies.get("server-token") };            
        } else {
            ctx.response.body = { 'error': 'server-token not found' };
        }
    } catch (error) {
        console.log("catch:", error);
    }
}