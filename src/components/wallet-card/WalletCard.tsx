import {
  Banknote,
  ChartCandlestick,
  CreditCard,
  PiggyBank,
} from "lucide-react";
import type { WalletCardProps, WalletType } from "../../types/WalletType";
import "./WalletCard.scss";
import { formatNumber } from "../../utils/formatMoney";

function WalletCard(props: WalletCardProps) {
  const { name, type, amount, onDelete, id, onEdit } = props;

  function typeIcon(type: WalletType["type"]) {
    if (type === "cash") {
      return <Banknote />;
    } else if (type === "card") {
      return <CreditCard />;
    } else if (type === "savings") {
      return <PiggyBank />;
    } else {
      return <ChartCandlestick />;
    }
  }

  return (
    <div className="wallet-card">
      <div className="wallet-card__icon">{typeIcon(type)}</div>
      <div className="wallet-card__text">
        <div className="wallet-card__name">{name}</div>
        <div className="wallet-card__amount">{formatNumber(amount)}</div>
      </div>
      {onDelete && <button onClick={() => onDelete(id)}>Удалить</button>}
      {onEdit && <button onClick={() => onEdit(id)}>Редактировать</button>}
    </div>
  );
}

export default WalletCard;
