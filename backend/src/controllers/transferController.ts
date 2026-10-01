import type { Request, Response } from "express";

import { prisma } from "../lib/prisma";
import type { AuthRequest } from "../middleware/authMiddleware";

export const createTransfer = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { amount, date, fromWalletId, toWalletId } = req.body;

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    res.status(400).json({ message: "Некорректная сумма перевода" });
    return;
  }

  if (typeof date !== "string" || date.trim().length === 0) {
    res.status(400).json({ message: "Некорректная дата перевода" });
    return;
  }

  if (typeof fromWalletId !== "string" || fromWalletId.trim().length === 0) {
    res.status(400).json({ message: "Некорректный исходный кошелёк" });
    return;
  }

  if (typeof toWalletId !== "string" || toWalletId.trim().length === 0) {
    res.status(400).json({ message: "Некорректный кошелёк назначения" });
    return;
  }

  if (fromWalletId === toWalletId) {
    res.status(400).json({
      message: "Нельзя перевести деньги на тот же кошелёк",
    });
    return;
  }

  try {
    const wallets = await prisma.wallet.findMany({
      where: {
        id: {
          in: [fromWalletId, toWalletId],
        },
        userId: authReq.userId!,
      },
    });

    if (wallets.length !== 2) {
      res.status(404).json({
        message: "Один или оба кошелька не найдены",
      });
      return;
    }

    const transfer = await prisma.transfer.create({
      data: {
        amount,
        date: new Date(date),
        fromWalletId,
        toWalletId,
      },
      include: {
        fromWallet: true,
        toWallet: true,
      },
    });

    res.status(201).json(transfer);
  } catch (error) {
    console.error("Ошибка при создании перевода:", error);

    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const getTransfers = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  try {
    const transfers = await prisma.transfer.findMany({
      where: {
        OR: [
          {
            fromWallet: {
              userId: authReq.userId!,
            },
          },
          {
            toWallet: {
              userId: authReq.userId!,
            },
          },
        ],
      },
      include: {
        fromWallet: true,
        toWallet: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json(transfers);
  } catch (error) {
    console.error("Ошибка при загрузке переводов:", error);

    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const updateTransfer = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const id = req.params.id as string;
  const { amount, date } = req.body;

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    res.status(400).json({ message: "Некорректная сумма перевода" });
    return;
  }

  if (typeof date !== "string" || date.trim().length === 0) {
    res.status(400).json({ message: "Некорректная дата перевода" });
    return;
  }

  try {
    const transfer = await prisma.transfer.findFirst({
      where: {
        id,
        OR: [
          {
            fromWallet: {
              userId: authReq.userId!,
            },
          },
          {
            toWallet: {
              userId: authReq.userId!,
            },
          },
        ],
      },
    });

    if (!transfer) {
      res.status(404).json({
        message: "Перевод не найден",
      });
      return;
    }

    const updatedTransfer = await prisma.transfer.update({
      where: { id },
      data: {
        amount,
        date: new Date(date),
      },
      include: {
        fromWallet: true,
        toWallet: true,
      },
    });

    res.json(updatedTransfer);
  } catch (error) {
    console.error("Ошибка при обновлении перевода:", error);

    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const deleteTransfer = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const id = req.params.id as string;

  try {
    const transfer = await prisma.transfer.findFirst({
      where: {
        id,
        OR: [
          {
            fromWallet: {
              userId: authReq.userId!,
            },
          },
          {
            toWallet: {
              userId: authReq.userId!,
            },
          },
        ],
      },
    });

    if (!transfer) {
      res.status(404).json({
        message: "Перевод не найден",
      });
      return;
    }

    await prisma.transfer.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Ошибка при удалении перевода:", error);

    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};
