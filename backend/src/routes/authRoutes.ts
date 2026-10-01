import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserMe,
  loginUser,
  logoutUser,
  updateUser,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/users", createUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserMe);
router.delete("/users/me", authMiddleware, deleteUser);
router.post("/logout", logoutUser);
router.put("/users/me", authMiddleware, updateUser);

export default router;
