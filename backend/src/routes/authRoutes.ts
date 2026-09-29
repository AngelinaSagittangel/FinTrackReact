import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserMe,
  loginUser,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/users", createUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserMe);
router.delete("/users/me", authMiddleware, deleteUser);

export default router;
