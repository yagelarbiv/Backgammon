import toast from "react-hot-toast";

export const toastStyle = (thisTurn) => {
  return {
    style: {
      borderRadius: "10px",
      background: thisTurn._turnPlayer._name,
      color: thisTurn._opponentPlayer._name,
      border:
        thisTurn._turnPlayer._name === "White"
          ? "2px solid black"
          : "2px solid white",
    },
  };
};

export function toastMessage(messageJSON) {
  const { message, turn } = JSON.parse(messageJSON);
  toast.success(message, toastStyle(turn));
}