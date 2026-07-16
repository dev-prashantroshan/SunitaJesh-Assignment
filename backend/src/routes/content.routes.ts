import { Router } from "express";
import { getPlaceholderContentController } from "../controllers/content.controller";

const router = Router();

router.get("/placeholder", getPlaceholderContentController);

export default router;
