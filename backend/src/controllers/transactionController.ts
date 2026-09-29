import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const createTransaction = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { amount, type, date, description, walletId, categoryId } = req.body;

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    res.status(400).json({
      message: "Некорректная сумма",
    });

    return;
  }

  if (type !== "income" && type !== "expense") {
    res.status(400).json({
      message: "Некорректный тип транзакции",
    });

    return;
  }

  if (typeof date !== "string" || date.trim().length === 0) {
    res.status(400).json({
      message: "Некорректная дата",
    });

    return;
  }

  if (typeof walletId !== "string" || walletId.trim().length === 0) {
    res.status(400).json({
      message: "Некорректный ID кошелька",
    });

    return;
  }

  if (typeof categoryId !== "string" || categoryId.trim().length === 0) {
    res.status(400).json({
      message: "Некорректный ID категории",
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

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: authReq.userId!,
      },
    });

    if (!category) {
      res.status(404).json({
        message: "Категория не найдена",
      });

      return;
    }

    if (category.type !== type) {
      res.status(400).json({
        message: "Тип категории не соответствует типу транзакции",
      });

      return;
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        date: new Date(date),
        description:
          typeof description === "string" && description.trim().length > 0
            ? description.trim()
            : null,
        walletId,
        categoryId,
      },
    });

    res.status(201).json(transaction);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });

    return;
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        wallet: {
          userId: authReq.userId!,
        },
      },
      include: {
        wallet: true,
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json(transactions);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { id: transactionId } = req.params;

  if (typeof transactionId !== "string") {
    res.status(400).json({
      message: "Некорректный ID транзакции",
    });

    return;
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        wallet: {
          userId: authReq.userId!,
        },
      },
      include: {
        wallet: true,
        category: true,
      },
    });

    if (!transaction) {
      res.status(404).json({
        message: "Транзакция не найдена",
      });

      return;
    }

    res.json(transaction);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { id: transactionId } = req.params;

  const { amount, type, date, description, walletId, categoryId } = req.body;

  if (typeof transactionId !== "string") {
    res.status(400).json({
      message: "Некорректный ID транзакции",
    });

    return;
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    res.status(400).json({
      message: "Некорректная сумма",
    });

    return;
  }

  if (type !== "income" && type !== "expense") {
    res.status(400).json({
      message: "Некорректный тип транзакции",
    });

    return;
  }

  if (typeof date !== "string" || date.trim().length === 0) {
    res.status(400).json({
      message: "Некорректная дата",
    });

    return;
  }

  if (typeof walletId !== "string" || walletId.trim().length === 0) {
    res.status(400).json({
      message: "Некорректный ID кошелька",
    });

    return;
  }

  if (typeof categoryId !== "string" || categoryId.trim().length === 0) {
    res.status(400).json({
      message: "Некорректный ID категории",
    });

    return;
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        wallet: {
          userId: authReq.userId!,
        },
      },
    });

    if (!transaction) {
      res.status(404).json({
        message: "Транзакция не найдена",
      });

      return;
    }

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

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: authReq.userId!,
      },
    });

    if (!category) {
      res.status(404).json({
        message: "Категория не найдена",
      });

      return;
    }

    if (category.type !== type) {
      res.status(400).json({
        message: "Тип категории не соответствует типу транзакции",
      });

      return;
    }

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        amount,
        type,
        date: new Date(date),
        description:
          typeof description === "string" && description.trim().length > 0
            ? description.trim()
            : null,
        walletId,
        categoryId,
      },
      include: {
        wallet: true,
        category: true,
      },
    });

    res.json(updatedTransaction);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { id: transactionId } = req.params;

  if (typeof transactionId !== "string") {
    res.status(400).json({
      message: "Некорректный ID транзакции",
    });

    return;
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        wallet: {
          userId: authReq.userId!,
        },
      },
    });

    if (!transaction) {
      res.status(404).json({
        message: "Транзакция не найдена",
      });

      return;
    }

    await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    res.status(204).send();
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};
