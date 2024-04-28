import { useEffect, useMemo, useState } from "react";
import "./Game.css";
import { io } from "socket.io-client";
import BoardBottom from "../../components/game-components/BoardBottom";
import BoardTop from "../../components/game-components/BoardTop";
import { useParams } from "react-router-dom";
import LoadingPage from "../../components/game-components/loading/LoadingPage";
import Timer from "../../components/game-components/timer/Timer";
import LoadingSpinner from "../../components/game-components/loading/LoadingSpinner";
import useGameEvents from "../../hooks/useGameEvents";
import { toastMessage } from "../../utils/functions";
import useHttpClient from "../../http/useHttp";
import Dice from "../../components/game-components/Dice/Dice";
import useGameState from "../../hooks/useGameState";
import { Button } from "@mui/material";
import toast from "react-hot-toast";

function Game() {
  const { users } = useParams();
  const socket = io(import.meta.env.VITE_APP_GAME_URL, { withCredentials: true });
  const [Socket, setSocket] = useState(null);
  console.log(Socket);
  const [username, opponent] = useMemo(() => {
    if (!users) return "";
    const parsedUsers = users?.split("&");
    const username = parsedUsers[0];
    const opponent = parsedUsers[1];
    return [username, opponent];
  }, [users]);
  const { joinGame } = useHttpClient();

  const { game, thisTurn, thisMove } = useGameState();

  const {
    handleUserJoined,
    handleDiceRoll,
    handleOpponentSelect,
    handleUserStartedGame,
    opponentStartedGame,
    handleOpponentLeft,
    handleUserSelect,
    rollDice,
    handleGameOver,
    timer,
    isLoading,
    isWaitingForOpponent,
    canPlay,
    isSelecting,
    player,
  } = useGameEvents(username, opponent);

  useEffect(() => {
    setSocket(socket);
    return () => socket && socket.close();
  }, []);

  useEffect(() => {
    async function tryJoin() {
      const joinSuccessful = await joinGame(username, opponent, socket.id);
      if (!joinSuccessful) {
        toast.error(
          "Could not join game or game is currently on, try again later."
        );
      }
    }
    tryJoin();
  }, [socket.id]);

  useEffect(() => {
    socket.on("user-connection", handleUserJoined);
    socket.on("user-rolled-dice", handleDiceRoll);
    socket.on("opponent-select", handleOpponentSelect);
    socket.on("opponent-started-game", opponentStartedGame);
    socket.on("changed-turn", toastMessage);
    socket.on("game-over", toastMessage);
    socket.on("on-game-won", (game) => handleGameOver(game, true));
    socket.on("user-disconnected", handleOpponentLeft);
    return () => {
      socket.off("user-connection", handleUserStartedGame);
      socket.off("user-rolled-dice", handleDiceRoll);
      socket.off("opponent-select", handleOpponentSelect);
      socket.off("opponent-started-game", opponentStartedGame);
      socket.off("changed-turn", toastMessage);
      socket.off("game-over", toastMessage);
      socket.off("user-disconnected", handleOpponentLeft);
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {isWaitingForOpponent && <LoadingPage />}
      {!isWaitingForOpponent && (
        <div>
          <div className="header">
            <h1>
              You play as <span className={player}>{player}</span>
            </h1>
            <div className="dice">
              {thisTurn._dices && canPlay && (
                <Dice dice={thisTurn._dices}></Dice>
              )}
            </div>
            <div>
              <Timer timer={timer} />
            </div>
          </div>
          <BoardTop
            game={game}
            thisMove={thisMove}
            select={handleUserSelect}
            isBlack={player === "Black"}
          />

          <BoardBottom
            game={game}
            thisMove={thisMove}
            rollDice={rollDice}
            startGame={handleUserStartedGame}
            select={handleUserSelect}
            canPlay={canPlay}
            isSelecting={isSelecting}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              margin: "1em",
            }}
          >
            <Button
              style={{ backgroundColor: "#904E55", color: "#fff" }}
              onClick={() => window.close()}
            >
              Quit game
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Game;
