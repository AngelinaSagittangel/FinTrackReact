import { useState } from "react";
import useTransactions from "../hooks/useTransactions";
import useCategories from "../hooks/useCategories";
import {
  getCategoryStatistics,
  getDailyStatistics,
  getMonthlyComparison,
  getMonthlyStatistics,
} from "../data/analytics";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { formatNumber } from "../utils/formatMoney";
import "./Analytics.scss";

const ITEMS_PER_PAGE = 10;

function Analytics() {
  const [period, setPeriod] = useState<1 | 3 | 6 | 12>(3);

  const [incomePage, setIncomePage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);

  const { transactions } = useTransactions();
  const { categories } = useCategories();

  const comparison = getMonthlyComparison(transactions);

  const monthlyStatistics = getMonthlyStatistics(transactions, period);

  const monthlyData =
    period === 1
      ? getDailyStatistics(transactions).map((day) => ({
          month: day.date,
          income: day.income,
          expense: day.expense,
          balance: day.balance,
        }))
      : Array.from(monthlyStatistics)
          .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
          .map(([month, statistics]) => {
            return {
              month,
              income: statistics.income,
              expense: statistics.expense,
              balance: statistics.balance,
            };
          });

  const hasEnoughMonths = period === 1 || monthlyData.length >= 3;

  function formatChartDate(date: string) {
    const [, month, day] = date.split("-");

    const monthNames = [
      "янв",
      "фев",
      "мар",
      "апр",
      "май",
      "июн",
      "июл",
      "авг",
      "сен",
      "окт",
      "ноя",
      "дек",
    ];

    return `${Number(day)} ${monthNames[Number(month) - 1]}`;
  }

  const categoryStatisticsIncome = getCategoryStatistics(
    transactions,
    "income",
    period,
  );

  const categoryStatisticsExpense = getCategoryStatistics(
    transactions,
    "expense",
    period,
  );

  // Сортируем категории от большей суммы к меньшей
  const incomeCategories = Array.from(categoryStatisticsIncome).sort(
    ([, amountA], [, amountB]) => amountB - amountA,
  );

  const expenseCategories = Array.from(categoryStatisticsExpense).sort(
    ([, amountA], [, amountB]) => amountB - amountA,
  );

  const totalIncome = incomeCategories.reduce(
    (sum, [, amount]) => sum + amount,
    0,
  );

  const totalExpense = expenseCategories.reduce(
    (sum, [, amount]) => sum + amount,
    0,
  );

  // Количество страниц
  const incomeTotalPages = Math.ceil(incomeCategories.length / ITEMS_PER_PAGE);

  const expenseTotalPages = Math.ceil(
    expenseCategories.length / ITEMS_PER_PAGE,
  );

  // Защищаемся от ситуации, когда количество категорий уменьшилось
  const safeIncomePage =
    incomeTotalPages === 0 ? 1 : Math.min(incomePage, incomeTotalPages);

  const safeExpensePage =
    expenseTotalPages === 0 ? 1 : Math.min(expensePage, expenseTotalPages);

  // Индексы начала текущей страницы
  const incomeStartIndex = (safeIncomePage - 1) * ITEMS_PER_PAGE;

  const expenseStartIndex = (safeExpensePage - 1) * ITEMS_PER_PAGE;

  // Категории текущей страницы
  const currentIncomeCategories = incomeCategories.slice(
    incomeStartIndex,
    incomeStartIndex + ITEMS_PER_PAGE,
  );

  const currentExpenseCategories = expenseCategories.slice(
    expenseStartIndex,
    expenseStartIndex + ITEMS_PER_PAGE,
  );

  function handlePeriodChange(value: 1 | 3 | 6 | 12) {
    setPeriod(value);

    // При смене периода возвращаемся на первую страницу
    setIncomePage(1);
    setExpensePage(1);
  }

  function showAnalytics(num: number) {
    if (num > 0) {
      return "up";
    } else if (num === 0) {
      return "neutral";
    } else {
      return "down";
    }
  }

  const incomeChange = showAnalytics(comparison.incomeChange.absolute);

  const expenseChange = showAnalytics(comparison.expenseChange.absolute);

  const balanceChange = showAnalytics(comparison.balanceChange.absolute);

  return (
    <section className="analytics">
      <header className="analytics__header">
        <h2>Аналитика</h2>

        <div className="analytics__button">
          <button
            className={period === 1 ? "active" : ""}
            onClick={() => handlePeriodChange(1)}
          >
            1 мес
          </button>

          <button
            className={period === 3 ? "active" : ""}
            onClick={() => handlePeriodChange(3)}
          >
            3 мес
          </button>

          <button
            className={period === 6 ? "active" : ""}
            onClick={() => handlePeriodChange(6)}
          >
            6 мес
          </button>

          <button
            className={period === 12 ? "active" : ""}
            onClick={() => handlePeriodChange(12)}
          >
            12 мес
          </button>
        </div>
      </header>

      <div className="analytics__cards">
        {/* Доходы */}
        <div className="analytics__cards-income">
          <h3>Доходы</h3>

          <div className="analytics__cards-income-summary">
            {formatNumber(comparison.currentSummary.income)}
          </div>

          <div className="analytics__cards-income-calc">
            {incomeChange === "up" ? (
              <div className="analytics__cards-income-absolute green">
                <ArrowUp />+{formatNumber(comparison.incomeChange.absolute)}
              </div>
            ) : incomeChange === "down" ? (
              <div className="analytics__cards-income-absolute red">
                <ArrowDown />
                {formatNumber(comparison.incomeChange.absolute)}
              </div>
            ) : (
              <div className="analytics__cards-income-absolute grey">
                <ArrowRight />
                {formatNumber(comparison.incomeChange.absolute)}
              </div>
            )}
          </div>
        </div>

        {/* Расходы */}
        <div className="analytics__cards-expense">
          <h3>Расходы</h3>

          <div className="analytics__cards-expense-summary">
            {formatNumber(comparison.currentSummary.expense)}
          </div>

          <div className="analytics__cards-expense-calc">
            {expenseChange === "up" ? (
              <div className="analytics__cards-expense-absolute red">
                <ArrowUp />+{formatNumber(comparison.expenseChange.absolute)}
              </div>
            ) : expenseChange === "down" ? (
              <div className="analytics__cards-expense-absolute green">
                <ArrowDown />
                {formatNumber(comparison.expenseChange.absolute)}
              </div>
            ) : (
              <div className="analytics__cards-expense-absolute grey">
                <ArrowRight />
                {formatNumber(comparison.expenseChange.absolute)}
              </div>
            )}
          </div>
        </div>

        {/* Баланс */}
        <div className="analytics__cards-balance">
          <h3>Баланс</h3>

          <div className="analytics__cards-balance-summary">
            {formatNumber(comparison.currentSummary.balance)}
          </div>

          <div className="analytics__cards-balance-calc">
            {balanceChange === "up" ? (
              <div className="analytics__cards-balance-absolute green">
                <ArrowUp />+{formatNumber(comparison.balanceChange.absolute)}
              </div>
            ) : balanceChange === "down" ? (
              <div className="analytics__cards-balance-absolute red">
                <ArrowDown />
                {formatNumber(comparison.balanceChange.absolute)}
              </div>
            ) : (
              <div className="analytics__cards-balance-absolute grey">
                <ArrowRight />
                {formatNumber(comparison.balanceChange.absolute)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* График */}
      <div className="analytics__charts">
        <h3 className="analytics__charts-title">Динамика баланса</h3>

        {!hasEnoughMonths ? (
          <div className="analytics__empty analytics__empty-chart">
            <p>Недостаточно данных для построения графика</p>

            <span>
              Добавьте операции минимум за 3 месяца, чтобы увидеть динамику
              баланса.
            </span>
          </div>
        ) : monthlyData.length === 0 ? (
          <div className="analytics__empty">Нет данных за выбранный период</div>
        ) : (
          <AreaChart
            margin={{ left: 40, right: 40 }}
            style={{
              width: "100%",
              aspectRatio: 1.618,
              maxWidth: 700,
            }}
            responsive
            data={monthlyData}
          >
            <defs>
              <linearGradient
                id="analyticsGradient"
                x1="1"
                y1="0"
                x2="0"
                y2="0"
              >
                <stop offset="5%" stopColor="#3F7D68" stopOpacity={0.3} />

                <stop offset="75%" stopColor="#3F7D68" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              dataKey="balance"
              type="monotone"
              stroke="#3F7D68"
              strokeWidth={2}
              fill="url(#analyticsGradient)"
              dot={{
                r: 3,
                fill: "#3F7D68",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              activeDot={false}
            />

            <XAxis
              dataKey="month"
              padding={{ left: 30, right: 30 }}
              tickFormatter={period === 1 ? formatChartDate : undefined}
            />

            <YAxis />
          </AreaChart>
        )}
      </div>

      {/* Категории */}
      <div className="analytics__categories">
        {/* Доходы по категориям */}
        <div className="analytics__categories-card">
          <h3>Доходы по категориям</h3>

          {incomeCategories.length === 0 ? (
            <div className="analytics__empty">
              Нет доходов за выбранный период
            </div>
          ) : (
            <>
              {currentIncomeCategories.map(([categoryId, amount]) => {
                const category = categories.find(
                  (item) => item.id === categoryId,
                );

                const percent =
                  totalIncome === 0 ? 0 : (amount / totalIncome) * 100;

                return (
                  <div className="analytics__category" key={categoryId}>
                    <div className="analytics__category-header">
                      <span>{category?.name ?? "Неизвестная категория"}</span>

                      <span>{formatNumber(amount)}</span>
                    </div>

                    <div className="analytics__category-percent">
                      {Math.round(percent)}% от доходов
                    </div>

                    <div className="analytics__category-progress">
                      <div
                        className="analytics__category-progress-bar income"
                        style={{
                          width: `${percent}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {incomeTotalPages > 1 && (
                <div className="analytics__pagination">
                  <button
                    type="button"
                    disabled={safeIncomePage === 1}
                    onClick={() => setIncomePage((page) => page - 1)}
                  >
                    ←
                  </button>

                  {Array.from(
                    { length: incomeTotalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      type="button"
                      key={page}
                      className={
                        page === safeIncomePage
                          ? "analytics__pagination-button--active"
                          : ""
                      }
                      onClick={() => setIncomePage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safeIncomePage === incomeTotalPages}
                    onClick={() => setIncomePage((page) => page + 1)}
                  >
                    →
                  </button>
                </div>
              )}

              {incomeTotalPages > 1 && (
                <div className="analytics__pagination-info">
                  Показано {incomeStartIndex + 1}–
                  {Math.min(
                    incomeStartIndex + ITEMS_PER_PAGE,
                    incomeCategories.length,
                  )}
                  из {incomeCategories.length}
                </div>
              )}
            </>
          )}
        </div>

        {/* Расходы по категориям */}
        <div className="analytics__categories-card">
          <h3>Расходы по категориям</h3>

          {expenseCategories.length === 0 ? (
            <div className="analytics__empty">
              Нет расходов за выбранный период
            </div>
          ) : (
            <>
              {currentExpenseCategories.map(([categoryId, amount]) => {
                const category = categories.find(
                  (item) => item.id === categoryId,
                );

                const percent =
                  totalExpense === 0 ? 0 : (amount / totalExpense) * 100;

                return (
                  <div className="analytics__category" key={categoryId}>
                    <div className="analytics__category-header">
                      <span>{category?.name ?? "Неизвестная категория"}</span>

                      <span>{formatNumber(amount)}</span>
                    </div>

                    <div className="analytics__category-percent">
                      {Math.round(percent)}% от расходов
                    </div>

                    <div className="analytics__category-progress">
                      <div
                        className="analytics__category-progress-bar expense"
                        style={{
                          width: `${percent}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {expenseTotalPages > 1 && (
                <div className="analytics__pagination">
                  <button
                    type="button"
                    disabled={safeExpensePage === 1}
                    onClick={() => setExpensePage((page) => page - 1)}
                  >
                    ←
                  </button>

                  {Array.from(
                    { length: expenseTotalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      type="button"
                      key={page}
                      className={
                        page === safeExpensePage
                          ? "analytics__pagination-button--active"
                          : ""
                      }
                      onClick={() => setExpensePage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safeExpensePage === expenseTotalPages}
                    onClick={() => setExpensePage((page) => page + 1)}
                  >
                    →
                  </button>
                </div>
              )}

              {expenseTotalPages > 1 && (
                <div className="analytics__pagination-info">
                  Показано {expenseStartIndex + 1}–
                  {Math.min(
                    expenseStartIndex + ITEMS_PER_PAGE,
                    expenseCategories.length,
                  )}
                  из {expenseCategories.length}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Analytics;
