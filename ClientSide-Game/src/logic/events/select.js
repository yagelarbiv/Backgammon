import { toast } from "react-hot-toast";
import { toastStyle } from "../../utils/functions";
import { calcMovesMade } from "../calculations/calc-moves-made";
import {
  calcEndingDiceBars,
  calcGettingOutOfOutMoves,
  calcPossibleMoves
} from "../calculations/calc-possible-moves";
import ThisMove from "../models/this-move";
import { readyToEnd } from "./end-game";
import { movingPiece } from "./moving";

export function selecting(index, game, thisTurn, thisMove) {
  const newMove = () => new ThisMove();
  function settingFromBar(game, index, thisTurn, thisMove) {
    const canGoTo = calcPossibleMoves(game, index, thisTurn);

    if (canGoTo.length !== 0) {
      thisMove._fromBarIdx = index;
      thisMove._canGoTo = canGoTo;
    } else {
      toast.error("You can't select there.", toastStyle(thisTurn));
    }

    return thisMove;
  }

  function settingFromOutBar(index, game, thisTurn, thisMove) {
    thisMove._fromBarIdx = index;

    const canGoTo = calcGettingOutOfOutMoves(game, thisTurn);
    thisMove._canGoTo = canGoTo;

    return thisMove;
  }

  function settingFromEndBar(index, game, thisTurn, thisMove) {
    if (readyToEnd(game, thisTurn)) {
      const endingDiceBars = calcEndingDiceBars(game, thisTurn);

      if (endingDiceBars.length !== 0) {
        thisMove._fromBarIdx = index;
        thisMove._canGoTo = endingDiceBars;
        return thisMove;
      } else {
        toast.error("You can't select there.", toastStyle(thisTurn));
      }
    }

    return thisMove;
  }

  function settingToBar(index, game, thisTurn, thisMove) {
    thisMove._toBarIdx = index;
    movingPiece(game, thisTurn, thisMove);
    thisTurn = calcMovesMade(thisTurn, thisMove);

    return thisTurn;
  }
  if (!game._gameOn) {
    toast.error("Begin a Game first!", toastStyle(thisTurn));
    return [game, thisTurn, thisMove];
  }

  if (!thisTurn._rolledDice) {
    toast.error("Roll a dice first!", toastStyle(thisTurn));
    return [game, thisTurn, thisMove];
  }

  if (
    thisTurn._turnPlayer._outBar.length == 0 &&
    index === thisTurn._turnPlayer._outBarIdx
  ) {
    toast.error("You have no pieces on out bar.", toastStyle(thisTurn));
    return [game, thisTurn, thisMove];
  }

  if (
    !thisTurn._turnPlayer._inTheEnd &&
    index === thisTurn._turnPlayer._endBarIdx
  ) {
    toast.error(
      `You have not brought all your
      pieces to the ending area yet.`,
      toastStyle(thisTurn)
    );
    return [game, thisTurn, thisMove];
  }

  if (
    thisMove._fromBarIdx === -1 &&
    typeof index === "number" &&
    game._board[index].length == 0
  ) {
    toast.error("You can't select an empty bar.", toastStyle(thisTurn));
    return [game, thisTurn, thisMove];
  }

  if (
    typeof index === "number" &&
    game._board[index].includes(thisTurn._opponentPlayer._name) &&
    game._board[index].length > 1
  ) {
    toast.error("You can't select opponent's bar.", toastStyle(thisTurn));
    return [game, thisTurn, thisMove];
  }

  if (
    thisTurn._turnPlayer._outBar.length !== 0 &&
    thisMove._fromBarIdx !== thisTurn._turnPlayer._outBarIdx &&
    index !== thisTurn._turnPlayer._outBarIdx
  ) {
    toast.error(
      `You have to play 
      your out pieces first.`,
      toastStyle(thisTurn)
    );
    return [game, thisTurn, thisMove];
  }

  // Deselecting 'from'
  if (index === thisMove._fromBarIdx) {
    thisMove = newMove();
    return [game, thisTurn, thisMove];
  }

  // Setting 'from' End Bar
  if (
    thisMove._fromBarIdx === -1 &&
    index === thisTurn._turnPlayer._endBarIdx
  ) {
    thisMove = settingFromEndBar(index, game, thisTurn, thisMove);
    return [game, thisTurn, thisMove];
  }

  // Setting 'from' Out Bar
  if (
    thisTurn._turnPlayer._outBar.length !== 0 &&
    index === thisTurn._turnPlayer._outBarIdx
  ) {
    thisMove = settingFromOutBar(index, game, thisTurn, thisMove);
    return [game, thisTurn, thisMove];
  }

  if (typeof index !== "number") {
    toast.error("You can't select opponent's bar.", toastStyle(thisTurn));
    return [game, thisTurn, thisMove];
  }

  // Main Bars
  if (
    // Setting 'from' Main Bar
    thisMove._fromBarIdx === -1 &&
    game._board[index].includes(thisTurn._turnPlayer._name)
  ) {
    thisMove = settingFromBar(game, index, thisTurn, thisMove);
    return [game, thisTurn, thisMove];
  } else if (
    // Setting 'to' Bar for main, out, and end moves
    thisMove._toBarIdx === -1 &&
    thisMove._canGoTo.includes(index)
  ) {
    thisTurn = settingToBar(index, game, thisTurn, thisMove);
    thisMove = newMove();

    if (!thisTurn._turnPlayer._inTheEnd && readyToEnd(game, thisTurn)) {
      thisTurn._turnPlayer._inTheEnd = true;

      toast.success(`${thisTurn._turnPlayer._icon} 
  is in the ending area!
  Select your ending bar
  & start putting pieces out.`),
        toastStyle(thisTurn);
    }
  }
}
