/* eslint-disable react/prop-types */
import { createContext } from "react";
import { useState } from "react";
import Game from "../logic/models/game";
import ThisTurn from "../logic/models/this-turn";
import ThisMove from "../logic/models/this-move";

export const GameStateContext = createContext([
  Game.new(),
  () => {},
  ThisTurn.new(),
  () => {},
  ThisMove.new(),
  () => {},
]);

export const GameStateProvider = ({ children }) => {
  const [game, setGame] = useState(Game.new);
  const [thisTurn, setThisTurn] = useState(ThisTurn.new);
  const [thisMove, setThisMove] = useState(ThisMove.new);

  return (
    <GameStateContext.Provider
      value={[game, setGame, thisTurn, setThisTurn, thisMove, setThisMove]}
    >
      {children}
    </GameStateContext.Provider>
  );
};