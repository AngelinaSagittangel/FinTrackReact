type InitialCategoryType = {
  name: string;
  color: string;
  type: "income" | "expense";
};
const categories: InitialCategoryType[] = [
  { name: "Продукты", color: "#3F7D68", type: "expense" },
  { name: "Машина", color: "#7189C7", type: "expense" },
  { name: "Питомцы", color: "#9582B8", type: "expense" },
  { name: "Зарплата", color: "#D99A78", type: "income" },
  { name: "Штрафы", color: "#C74BA6", type: "expense" },
];
export default categories;
