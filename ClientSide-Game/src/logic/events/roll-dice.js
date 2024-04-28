import toast from "react-hot-toast";
import { toastStyle } from "../../utils/functions";
import ThisTurn from "../models/this-turn";

export function dice() {
    const first = Math.floor(Math.random() * 6) + 1;
    const second = Math.floor(Math.random() * 6) + 1;
    return [first, second];
}

export function rollingDice(tempTurn) {
    const thisTurn = new ThisTurn(
        tempTurn._turnPlayer,
        tempTurn._opponentPlayer,
        dice(),
        true
    );
    getDiceToast(thisTurn._dices[0], thisTurn._dices[1], thisTurn);
    return thisTurn;
}

export function getDiceToast(dice1, dice2, turn) {
    if (dice1 === dice2) {
        toast.success(
            `${turn._turnPlayer._icon}
            🎲 Rolled a double ${turn._dices} 🎲`,
            toastStyle(turn)
        );
    } else {
        toast.success(
            `${turn._turnPlayer._icon}
            🎲 Rolled ${turn._dices} 🎲`,
            toastStyle(turn)
        );
    }
}