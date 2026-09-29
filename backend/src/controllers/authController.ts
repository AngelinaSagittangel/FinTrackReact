import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/authMiddleware";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (typeof email !== "string" || email.length === 0) {
    res.status(400).json({ message: "Некорректный email" });
    return;
  }
  if (typeof password !== "string" || password.length < 6) {
    res
      .status(400)
      .json({ message: "Пароль должен содержать минимум 6 символов" });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res
      .status(201)
      .json({ id: user.id, email: user.email, createdAt: user.createdAt });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res
        .status(409)
        .json({ message: "Пользователь с таким email уже существует" });
      return;
    }
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (typeof email !== "string" || email.length === 0) {
    res.status(400).json({ message: "Некорректный email" });
    return;
  }
  if (typeof password !== "string" || password.length === 0) {
    res.status(400).json({ message: "Некорректный пароль" });
    return;
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Неверный email или пароль" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Неверный email или пароль" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
    res.json({
      token,
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
    });
  } catch {
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};

export const getUserMe = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const user = await prisma.user.findUnique({
    where: { id: authReq.userId },
    select: { id: true, email: true, createdAt: true },
  });
  if (!user) {
    res.status(404).json({ message: "Пользователь не найден" });
    return;
  }
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  try {
    await prisma.$transaction([
      prisma.transaction.deleteMany({
        where: {
          wallet: {
            userId: authReq.userId!,
          },
        },
      }),

      prisma.budget.deleteMany({
        where: {
          userId: authReq.userId!,
        },
      }),

      prisma.wallet.deleteMany({
        where: {
          userId: authReq.userId!,
        },
      }),

      prisma.category.deleteMany({
        where: {
          userId: authReq.userId!,
        },
      }),

      prisma.user.delete({
        where: {
          id: authReq.userId!,
        },
      }),
    ]);

    res.status(204).send();
  } catch {
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
};
