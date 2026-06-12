import { Router } from "express";
import { getStoreConfig, updateStoreConfig } from "../controllers/storeController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = Router();
router.get("/", getStoreConfig);
router.put("/", protect, adminOnly, updateStoreConfig);
export default router;
