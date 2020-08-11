import { Router } from "../deps.ts";

import { login, logout, token } from "../controllers/auth.ts";
import authorize from "../middleware/authorize.ts";

const router = new Router();

router.get("/auth/token", token)
      .post("/auth/login", login)
      .post("/auth/logout", authorize, logout);

export default router;