export const formatNumber = (value: number) => {
  const currentNumber = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  });

  return currentNumber.format(value);
};
