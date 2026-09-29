import { ArrowDown, ArrowLeftRight, ArrowUp } from "lucide-react";
import type { ActionButtonType } from "../../types/ActionButtonType";
import "./ActionButton.scss";

function ActionButton({ type, onClick }: ActionButtonType) {
  const typeButton = {
    income: "Доход",
    expense: "Расход",
    transfer: "Трансфер",
  };

  const typeIcon = {
    income: <ArrowUp />,
    expense: <ArrowDown />,
    transfer: <ArrowLeftRight />,
  };

  const typeStyles = {
    income: {
      buttonColor: "#3f8f6820",
      textColor: "#3f8f68",
    },
    expense: {
      buttonColor: "#C96F6820",
      textColor: "#C96F68",
    },
    transfer: {
      buttonColor: "#7189C720",
      textColor: "#7189C7",
    },
  };

  return (
    <button
      className="action-button"
      style={
        {
          "--button-color": typeStyles[type].buttonColor,
          "--text-color": typeStyles[type].textColor,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      {typeIcon[type]}
      {typeButton[type]}
    </button>
  );
}

export default ActionButton;
