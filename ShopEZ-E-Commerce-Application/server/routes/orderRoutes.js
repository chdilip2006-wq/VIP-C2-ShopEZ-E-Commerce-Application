import { Router } from "express";
import {
  allOrders,
  cancelMyOrder,
  createOrder,
  dashboardStats,
  myOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = Router();
router.post("/", protect, createOrder);
router.get("/mine", protect, myOrders);
router.patch("/:id/cancel", protect, cancelMyOrder);
router.get("/admin/stats", protect, adminOnly, dashboardStats);
router.get("/", protect, adminOnly, allOrders);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);
export default router;
