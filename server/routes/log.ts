import { Router } from "../deps.ts";

import { log } from "../controllers/log.ts";
import authorize from "../middleware/authorize.ts";

const router = new Router();

router.post("/log", authorize, log);

export default router;