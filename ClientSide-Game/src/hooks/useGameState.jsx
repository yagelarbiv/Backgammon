import { useContext } from "react";
import { GameStateContext } from "../state/GameContext";

const useGameState = () => {
  const contextValue = useContext(GameStateContext);

  if (!contextValue) {
    throw new Error("GameStateContext value is undefined");
  }

  const [game, setGame, thisTurn, setThisTurn, thisMove, setThisMove] = contextValue;

  const updateTurn = (newTurn) => {
    setThisTurn(newTurn);
  };
  const updateMove = (newMove) => {
    setThisMove(newMove);
  };
  const updateGame = (newGame) => {
    setGame(newGame);
  };

  return { game, updateGame, thisTurn, updateTurn, thisMove, updateMove };
};

export default useGameState;