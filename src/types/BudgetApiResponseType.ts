export type BudgetApiResponseType = {
  id: string;
  amount: string | number;
  month: number;
  year: number;
  createdAt: string;
  userId: string;
  categoryId: string;

  category: {
    id: string;
    name: string;
    color: string;
    type: "income" | "expense";
    userId: string;
    createdAt: string;
  };

  spent: string | number;
  remaining: string | number;
  percent: string | number;
};
