import type { TransactionType } from "../types/TransactionType";

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
}

export function getStartDate(period: 1 | 3 | 6 | 12) {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  return formatDate(year, month - period + 1, 1);
}

export function getTransactionsByPeriod(
  transactions: TransactionType[],
  period: 1 | 3 | 6 | 12,
) {
  const startDate = getStartDate(period);

  return transactions.filter((item) => item.date >= startDate);
}

export function getPeriodSummary(transactions: TransactionType[]) {
  const income = transactions.reduce((acc, item) => {
    if (item.type === "income") {
      return acc + item.amount;
    }

    return acc;
  }, 0);

  const expense = transactions.reduce((acc, item) => {
    if (item.type === "expense") {
      return acc + item.amount;
    }

    return acc;
  }, 0);

  const balance = income - expense;

  return {
    income,
    expense,
    balance,
  };
}

export function getMonthlyStatistics(
  transactions: TransactionType[],
  period: 1 | 3 | 6 | 12,
) {
  const periodTransactions = getTransactionsByPeriod(transactions, period);

  const monthlyStats = new Map<string, ReturnType<typeof getPeriodSummary>>();

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  for (let i = period - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);

    const year = date.getFullYear();
    const month = date.getMonth();

    const monthKey = formatDate(year, month, 1).slice(0, -3);

    monthlyStats.set(monthKey, {
      income: 0,
      expense: 0,
      balance: 0,
    });
  }

  periodTransactions.forEach((item) => {
    const month = item.date.slice(0, -3);

    const currentStats = monthlyStats.get(month);

    if (!currentStats) {
      return;
    }

    if (item.type === "income") {
      currentStats.income += item.amount;
    } else {
      currentStats.expense += item.amount;
    }

    currentStats.balance = currentStats.income - currentStats.expense;
  });

  return monthlyStats;
}
export function getDailyStatistics(transactions: TransactionType[]) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const startDate = formatDate(year, month, 1);
  const endDate = formatDate(year, month + 1, 1);

  const previousTransactions = transactions.filter((item) => {
    return item.date < startDate;
  });

  const previousBalance = getPeriodSummary(previousTransactions).balance;

  const currentMonthTransactions = transactions.filter((item) => {
    return item.date >= startDate && item.date < endDate;
  });

  const days = new Map<string, TransactionType[]>();

  currentMonthTransactions.forEach((item) => {
    const day = item.date;

    if (days.has(day)) {
      days.get(day)?.push(item);
    } else {
      days.set(day, [item]);
    }
  });

  const dailyStatistics = Array.from(days)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, dayTransactions]) => {
      const summary = getPeriodSummary(dayTransactions);

      return {
        date,
        income: summary.income,
        expense: summary.expense,
      };
    });

  let balance = previousBalance;

  return dailyStatistics.map((day) => {
    balance += day.income - day.expense;

    return {
      ...day,
      balance,
    };
  });
}

export function getCategoryStatistics(
  transactions: TransactionType[],
  type: "income" | "expense",
  period: 1 | 3 | 6 | 12,
) {
  const periodTransactions = getTransactionsByPeriod(transactions, period);

  const filteredTransactions = periodTransactions.filter(
    (item) => item.type === type,
  );

  const categories = new Map<string, number>();

  filteredTransactions.forEach((item) => {
    const savedCategory = categories.get(item.categoryId);

    categories.set(item.categoryId, (savedCategory ?? 0) + item.amount);
  });

  return categories;
}

export function getPreviousMonthTransactions(transactions: TransactionType[]) {
  const today = new Date();

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const startDate = formatDate(currentYear, currentMonth - 1, 1);

  const endDate = formatDate(currentYear, currentMonth, 1);

  return transactions.filter(
    (item) => item.date >= startDate && item.date < endDate,
  );
}

export function getMonthlyComparison(transactions: TransactionType[]) {
  const current = getTransactionsByPeriod(transactions, 1);

  const currentSummary = getPeriodSummary(current);

  const previous = getPreviousMonthTransactions(transactions);

  const previousSummary = getPeriodSummary(previous);

  const incomeChange = getChange(currentSummary.income, previousSummary.income);

  const expenseChange = getChange(
    currentSummary.expense,
    previousSummary.expense,
  );

  const balanceChange = getChange(
    currentSummary.balance,
    previousSummary.balance,
  );

  return {
    currentSummary,
    previousSummary,
    incomeChange,
    expenseChange,
    balanceChange,
  };
}

export function getChange(current: number, previous: number) {
  const absolute = current - previous;

  const percent =
    previous === 0 ? null : ((current - previous) / previous) * 100;

  return {
    absolute,
    percent,
  };
}
