import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

import { AuthRequest } from "../middleware/authMiddleware";

export const createCategory = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { name, type } = req.body;

  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({
      message: "Некорректное название категории",
    });

    return;
  }

  if (type !== "income" && type !== "expense") {
    res.status(400).json({
      message: "Некорректный тип категории",
    });

    return;
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        type,
        userId: authReq.userId!,
      },
    });

    res.status(201).json(category);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: authReq.userId!,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(categories);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { id: categoryId } = req.params;
  const { name } = req.body;

  if (typeof categoryId !== "string") {
    res.status(400).json({
      message: "Некорректный ID категории",
    });

    return;
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({
      message: "Некорректное название категории",
    });

    return;
  }

  try {
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

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: name.trim(),
      },
    });

    res.json(updatedCategory);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { id: categoryId } = req.params;

  if (typeof categoryId !== "string") {
    res.status(400).json({
      message: "Некорректный ID категории",
    });

    return;
  }

  try {
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

    const transactionCount = await prisma.transaction.count({
      where: {
        categoryId,
      },
    });

    if (transactionCount > 0) {
      res.status(409).json({
        message: "Нельзя удалить категорию, которая используется в транзакциях",
      });

      return;
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    res.status(204).send();
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};
