import cors from "cors";
import express from "express";

import budgetRoutes from "./routes/budgetRoutes";
import walletRoutes from "./routes/walletRoutes";
import categoriesRoutes from "./routes/categoriesRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import transferRoutes from "./routes/transferRoutes";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    message: "API is working",
  });
});

// auth
app.use("/api", authRoutes);

// Кошельки
app.use("/api/wallets", walletRoutes);

// Категории
app.use("/api/categories", categoriesRoutes);

// Транзакции
app.use("/api/transactions", transactionRoutes);

// Бюджеты
app.use("/api/budgets", budgetRoutes);

app.use("/api/transfers", transferRoutes);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
