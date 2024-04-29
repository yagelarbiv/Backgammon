import toast from "react-hot-toast";
import ThisTurn from "../logic/models/this-turn";
import axios from "axios";
export const toastStyle = (thisTurn: ThisTurn) => {
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

  export function toastMessage(messageJSON: string) {
    const { message, turn } = JSON.parse(messageJSON);
    toast.success(message, toastStyle(turn));
  }
  export async function refreshTokens(Token: string) : Promise<string[]> {
    const response = await axios.post("https://localhost:6001/api/Auth/refresh", {
      accessToken: Token,
    });
  return response.data;
  }