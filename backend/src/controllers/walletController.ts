import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { AuthRequest } from "../middleware/authMiddleware";

export const createWallet = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { name, initialBalance } = req.body;

  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({
      message: "Некорректное название кошелька",
    });

    return;
  }

  if (
    typeof initialBalance !== "number" ||
    !Number.isFinite(initialBalance) ||
    initialBalance < 0
  ) {
    res.status(400).json({
      message: "Некорректный начальный баланс",
    });

    return;
  }

  try {
    const wallet = await prisma.wallet.create({
      data: {
        name: name.trim(),
        initialBalance,
        userId: authReq.userId!,
      },
    });

    res.status(201).json(wallet);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const getWallets = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  try {
    const wallets = await prisma.wallet.findMany({
      where: {
        userId: authReq.userId!,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(wallets);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const updateWallet = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { id: walletId } = req.params;
  const { name, initialBalance } = req.body;

  if (typeof walletId !== "string") {
    res.status(400).json({
      message: "Некорректный ID кошелька",
    });

    return;
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({
      message: "Некорректное название кошелька",
    });

    return;
  }

  if (
    typeof initialBalance !== "number" ||
    !Number.isFinite(initialBalance) ||
    initialBalance < 0
  ) {
    res.status(400).json({
      message: "Некорректный начальный баланс",
    });

    return;
  }

  try {
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: authReq.userId!,
      },
    });

    if (!wallet) {
      res.status(404).json({
        message: "Кошелёк не найден",
      });

      return;
    }

    const transactionCount = await prisma.transaction.count({
      where: {
        walletId,
      },
    });

    const updatedWallet = await prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        name: name.trim(),
        initialBalance:
          transactionCount > 0 ? wallet.initialBalance : initialBalance,
      },
    });

    res.json(updatedWallet);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const deleteWallet = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { id: walletId } = req.params;

  if (typeof walletId !== "string") {
    res.status(400).json({
      message: "Некорректный ID кошелька",
    });

    return;
  }

  try {
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: authReq.userId!,
      },
    });

    if (!wallet) {
      res.status(404).json({
        message: "Кошелёк не найден",
      });

      return;
    }

    const transactionCount = await prisma.transaction.count({
      where: {
        walletId,
      },
    });

    if (transactionCount > 0) {
      res.status(409).json({
        message: "Нельзя удалить кошелёк, который используется в транзакциях",
      });

      return;
    }

    await prisma.wallet.delete({
      where: {
        id: walletId,
      },
    });

    res.status(204).send();
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};
