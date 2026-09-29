export type ActionButtonType = {
  type: "income" | "expense" | "transfer";

  onClick: () => void;
};
