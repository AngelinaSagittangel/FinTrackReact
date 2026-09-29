import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const createBudget = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { amount, month, year, categoryId } = req.body;

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    res.status(400).json({
      message: "Некорректная сумма бюджета",
    });

    return;
  }

  if (
    typeof month !== "number" ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    res.status(400).json({
      message: "Некорректный месяц",
    });

    return;
  }

  if (typeof year !== "number" || !Number.isInteger(year) || year < 2000) {
    res.status(400).json({
      message: "Некорректный год",
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

    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: authReq.userId!,
        categoryId,
        month,
        year,
      },
    });

    if (existingBudget) {
      res.status(409).json({
        message: "Бюджет для этой категории за данный месяц уже существует",
      });

      return;
    }

    const budget = await prisma.budget.create({
      data: {
        amount,
        month,
        year,
        categoryId,
        userId: authReq.userId!,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(budget);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const getBudgets = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  try {
    const budgets = await prisma.budget.findMany({
      where: {
        userId: authReq.userId!,
      },
      include: {
        category: true,
      },
      orderBy: [
        {
          year: "desc",
        },
        {
          month: "desc",
        },
      ],
    });

    const budgetsWithStats = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(Date.UTC(budget.year, budget.month - 1, 1));

        const endDate = new Date(Date.UTC(budget.year, budget.month, 1));

        const result = await prisma.transaction.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            categoryId: budget.categoryId,
            type: "expense",
            date: {
              gte: startDate,
              lt: endDate,
            },
          },
        });

        const spent = result._sum.amount ?? new Prisma.Decimal(0);
        const remaining = budget.amount.minus(spent);

        const percent =
          budget.amount.toNumber() === 0
            ? 0
            : spent.div(budget.amount).mul(100);

        return {
          ...budget,
          spent,
          remaining,
          percent,
        };
      }),
    );

    res.json(budgetsWithStats);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { id: budgetId } = req.params;
  const { amount, month, year, categoryId } = req.body;

  if (typeof budgetId !== "string") {
    res.status(400).json({
      message: "Некорректный ID бюджета",
    });

    return;
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    res.status(400).json({
      message: "Некорректная сумма бюджета",
    });

    return;
  }

  if (
    typeof month !== "number" ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    res.status(400).json({
      message: "Некорректный месяц",
    });

    return;
  }

  if (typeof year !== "number" || !Number.isInteger(year) || year < 2000) {
    res.status(400).json({
      message: "Некорректный год",
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
    const budget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId: authReq.userId!,
      },
    });

    if (!budget) {
      res.status(404).json({
        message: "Бюджет не найден",
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

    if (category.type !== "expense") {
      res.status(400).json({
        message: "Бюджет можно создать только для категории расходов",
      });

      return;
    }

    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: authReq.userId!,
        categoryId,
        month,
        year,
        NOT: {
          id: budgetId,
        },
      },
    });

    if (existingBudget) {
      res.status(409).json({
        message: "Бюджет для этой категории за данный месяц уже существует",
      });

      return;
    }

    const updatedBudget = await prisma.budget.update({
      where: {
        id: budgetId,
      },
      data: {
        amount,
        month,
        year,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    res.json(updatedBudget);
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { id: budgetId } = req.params;

  if (typeof budgetId !== "string") {
    res.status(400).json({
      message: "Некорректный ID бюджета",
    });

    return;
  }

  try {
    const budget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId: authReq.userId!,
      },
    });

    if (!budget) {
      res.status(404).json({
        message: "Бюджет не найден",
      });

      return;
    }

    await prisma.budget.delete({
      where: {
        id: budgetId,
      },
    });

    res.status(204).send();
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};
