import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import {
  createTransfer,
  deleteTransfer,
  getTransfers,
  updateTransfer,
} from "../controllers/transferController";

const router = Router();

router.post("/", authMiddleware, createTransfer);
router.get("/", authMiddleware, getTransfers);
router.put("/:id", authMiddleware, updateTransfer);
router.delete("/:id", authMiddleware, deleteTransfer);

export default router;
