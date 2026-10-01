import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      message: "Требуется авторизация",
    });

    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    req.userId = payload.userId;

    next();
  } catch {
    res.status(401).json({
      message: "Недействительный или истёкший токен",
    });
  }
};
