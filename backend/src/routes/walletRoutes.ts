import { Router } from "express";

import {
  createWallet,
  deleteWallet,
  getWallets,
  updateWallet,
} from "../controllers/walletController";

import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createWallet);

router.get("/", authMiddleware, getWallets);

router.put("/:id", authMiddleware, updateWallet);

router.delete("/:id", authMiddleware, deleteWallet);

export default router;
