import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/transactionController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getTransactions);
router.get("/:id", authMiddleware, getTransaction);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;
