import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import "./Overview.scss";
import { Area, AreaChart, Cell, Pie, PieChart } from "recharts";
import { getAmountWallet } from "../data/waletts";
import WalletCard from "../components/wallet-card/WalletCard";
import {
  getAmountForMonth,
  getExpenses,
  getExpensesByCategory,
  getTotalBalance,
  getTotalExpenses,
  getTotalIncome,
} from "../data/transactions";
import { formatNumber } from "../utils/formatMoney";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/action-button/ActionButton";
import useTransactions from "../hooks/useTransactions";
import useTransfers from "../hooks/useTransfers";
import useWallets from "../hooks/useWallets";
import useCategories from "../hooks/useCategories";
import { useAuth } from "../hooks/useAuth";
import {
  getMonthlyComparison,
  getTransactionsByPeriod,
} from "../data/analytics";

function Overview() {
  const { transactions } = useTransactions();
  const { transfers } = useTransfers();
  const { wallets } = useWallets();
  const { categories } = useCategories();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const monthlyComparison = getMonthlyComparison(transactions);

  const date = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const today = new Date();

  const currentMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}`;

  const data = getAmountForMonth(currentMonth, transactions, transfers);

  const renderConstantDot = (props: {
    cx?: number;
    cy?: number;
    index?: number;
  }) => {
    const { cx, cy, index } = props;

    if (index === data.length - 1) {
      return (
        <circle key={`dot-${index}`} cx={cx} cy={cy} r={6} fill="#3F7D68" />
      );
    }

    return null;
  };

  const currentMonthTransactions = getTransactionsByPeriod(transactions, 1);

  const expenses = getExpenses(currentMonthTransactions);

  const expenseByCategory = getExpensesByCategory(expenses);

  const allExpenseChartData = Object.entries(expenseByCategory)
    .map(([categoryId, categoryData]) => {
      const category = categories.find((item) => item.id === categoryId);

      return {
        id: categoryId,
        name: category?.name ?? "Неизвестная категория",
        value: categoryData.amount,
        color: categoryData.color,
      };
    })
    .sort((a, b) => b.value - a.value);

  const topCategories = allExpenseChartData.slice(0, 5);

  const otherAmount = allExpenseChartData
    .slice(5)
    .reduce((total, item) => total + item.value, 0);

  const expenseChartData =
    otherAmount > 0
      ? [
          ...topCategories,
          {
            id: "other",
            name: "Другое",
            value: otherAmount,
            color: "#A2A6A3",
          },
        ]
      : topCategories;

  const [activeCategories, setActiveCategories] = useState(
    expenseChartData.map((item) => item.id),
  );

  const toggleCategory = (categoryId: string) => {
    setActiveCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((item) => item !== categoryId);
      }

      return [...prev, categoryId];
    });
  };

  const filteredExpenseData = expenseChartData.filter((item) =>
    activeCategories.includes(item.id),
  );

  const filteredTotalExpenses = filteredExpenseData.reduce(
    (total, item) => total + item.value,
    0,
  );

  return (
    <section className="overview">
      <header className="overview__header">
        <div className="overview__user">Здравствуйте, {currentUser?.name}</div>

        <div className="overview__date">{date}</div>
      </header>

      <div className="overview__all-finance">
        <div className="overview__balance">
          <span className="overview__label">Общий баланс:</span>

          <span className="overview__amount">
            {formatNumber(getTotalBalance(transactions, wallets, transfers))}
          </span>

          <span className="overview__change">
            Изменение за месяц:
            {monthlyComparison.balanceChange.absolute > 0 ? "+" : ""}
            {formatNumber(monthlyComparison.balanceChange.absolute)}
          </span>

          <span className="overview__change">к предыдущему месяцу</span>
        </div>

        <div className="overview__graphic">
          <AreaChart
            style={{
              width: "100%",
              aspectRatio: 2.2,
              maxWidth: 420,
            }}
            responsive
            data={data}
          >
            <defs>
              <linearGradient id="colorUv" x1="1" y1="0" x2="0" y2="0">
                <stop offset="5%" stopColor="#3F7D68" stopOpacity={0.3} />
                <stop offset="75%" stopColor="#3F7D68" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              dataKey="balance"
              type="monotone"
              stroke="#3F7D68"
              dot={renderConstantDot}
              activeDot={false}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </div>

        <div className="overview__summary">
          <div className="summary">
            <div className="summary__icon">
              <BanknoteArrowUp />
            </div>

            <div className="summary__text">
              <div className="summary__name">Доход</div>

              <div className="summary__amount">
                {formatNumber(getTotalIncome(transactions))}
              </div>

              <div className="summary__description">
                {monthlyComparison.incomeChange.absolute > 0 ? "+" : ""}
                {formatNumber(monthlyComparison.incomeChange.absolute)}
                <br />к предыдущему месяцу
              </div>
            </div>
          </div>

          <div className="summary">
            <div className="summary__icon">
              <BanknoteArrowDown />
            </div>

            <div className="summary__text">
              <div className="summary__name">Расход</div>

              <div className="summary__amount">
                {formatNumber(getTotalExpenses(transactions))}
              </div>

              <div className="summary__description">
                {monthlyComparison.expenseChange.absolute > 0 ? "+" : ""}
                {formatNumber(monthlyComparison.expenseChange.absolute)}
                <br />к предыдущему месяцу
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overview__wallets">
        {getAmountWallet(transactions, wallets, transfers)
          .slice(0, 4)
          .map((wallet) => (
            <WalletCard key={wallet.id} {...wallet} />
          ))}
      </div>

      <div className="overview__bottom">
        <div className="overview__expense">
          <div className="expense__header">
            <div className="expense__name">Расходы по категориям</div>

            <div className="expense__date"></div>
          </div>

          <div className="expense__actions">
            <div className="expense__diagram">
              {filteredExpenseData.length === 0 ? (
                <div className="expense__warning-text">
                  Выберите категории для отображения
                </div>
              ) : (
                <PieChart
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "260px",
                    maxHeight: "260px",
                    aspectRatio: 1,
                  }}
                  responsive
                >
                  <Pie
                    data={filteredExpenseData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="75%"
                    fill="#82ca9d"
                    stroke="white"
                  >
                    {filteredExpenseData.map((item) => (
                      <Cell key={item.id} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </div>

            <div className="expense__transactions">
              {expenseChartData.map((item) => (
                <label
                  key={item.id}
                  className="transactions__toggle"
                  style={
                    {
                      "--category-color": item.color,
                    } as React.CSSProperties
                  }
                >
                  <input
                    className="transactions__input"
                    type="checkbox"
                    onChange={() => toggleCategory(item.id)}
                    checked={activeCategories.includes(item.id)}
                  />

                  <span className="transactions__slider"></span>

                  <div className="transaction__name">{item.name}</div>

                  <div className="transaction__amount">
                    {formatNumber(item.value)}
                  </div>

                  <div className="transaction__percent">
                    {activeCategories.includes(item.id)
                      ? filteredTotalExpenses === 0
                        ? "0 %"
                        : `${(
                            (item.value / filteredTotalExpenses) *
                            100
                          ).toFixed(1)} %`
                      : "-"}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="overview__actions">
          <div className="actions__header">Добавить операцию</div>

          <div className="actions__buttons">
            <ActionButton
              type="income"
              onClick={() =>
                navigate("/activity", {
                  state: { type: "income" },
                })
              }
            />

            <ActionButton
              type="expense"
              onClick={() =>
                navigate("/activity", {
                  state: { type: "expense" },
                })
              }
            />

            <ActionButton
              type="transfer"
              onClick={() =>
                navigate("/activity", {
                  state: { type: "transfer" },
                })
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Overview;
