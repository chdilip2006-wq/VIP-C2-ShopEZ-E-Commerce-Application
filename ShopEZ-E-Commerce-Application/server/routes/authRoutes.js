import { Router } from "express";
import { listUsers, login, profile, register } from "../controllers/authController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);
router.get("/users", protect, adminOnly, listUsers);
export default router;
