import { io } from "socket.io-client";
import "react-dotenv";

console.log(import.meta.env.VITE_APP_GAME_URL)
const socket = io(import.meta.env.VITE_APP_GAME_URL, {
  withCredentials: true
});
export function movingPiece(game, thisTurn, thisMove) {
  const [fromBarIdx, toBarIdx] = [thisMove._fromBarIdx, thisMove._toBarIdx];

  // Throwing opponent piece out
  if (game._board[toBarIdx].includes(thisTurn._opponentPlayer._name)) {
    thisTurn._opponentPlayer._outBar.push(game._board[toBarIdx].pop());

    thisTurn._opponentPlayer._inTheEnd = false;

    game._whitePlayer = thisTurn._opponentPlayer._name === game._whitePlayer._name ? thisTurn._opponentPlayer : game._blackPlayer = thisTurn._opponentPlayer;
  }

  // Returning an out piece
  if (fromBarIdx === thisTurn._turnPlayer._outBarIdx) {
    game._board[toBarIdx].push(thisTurn._turnPlayer._outBar.pop());

    game._whitePlayer = thisTurn._turnPlayer._name === game._whitePlayer._name ? thisTurn._turnPlayer : game._blackPlayer = thisTurn._turnPlayer;

    return game;
  }

  // Taking a piece out to end bar
  if (fromBarIdx === thisTurn._turnPlayer._endBarIdx) {
    thisTurn._turnPlayer._endBar.push(game._board[toBarIdx].pop());

    game._whitePlayer = thisTurn._turnPlayer._name === game._whitePlayer._name ? thisTurn._turnPlayer : game._blackPlayer = thisTurn._turnPlayer;

    if (thisTurn._turnPlayer._endBar.length === 15) {
      game._gameOn = false;
      socket.emit("game-win", JSON.stringify(game));
    }

    return game;
  }

  // Moving from 'from' to 'to'
  game._board[toBarIdx].push(game._board[fromBarIdx].pop());

  return game;
}
