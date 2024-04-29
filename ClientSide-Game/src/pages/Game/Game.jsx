import { useEffect, useState } from "react";
import "./Game.css";
import { io } from "socket.io-client";
import BoardBottom from "../../components/game-components/BoardBottom";
import BoardTop from "../../components/game-components/BoardTop";
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
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Game() {
  const query = useQuery();
  const username = query.get('user');
  const opponent = query.get('opponent');
  const token = query.get('token');  // Uncomment if the token is used later
  console.log(token);
  const [socket, setSocket] = useState(null);

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

  // Initialize socket connection only once
  useEffect(() => {
    const newSocket = io('http://localhost:3003', {
            withCredentials: true,
            transports: ['websocket']  // Ensuring to use WebSockets
        });
    setSocket(newSocket);
    newSocket.emit("connection", () => {
      console.log("Connected to server");
    });
    newSocket.emit("set_name", username);
    newSocket.on("user-connection", handleUserJoined);
    newSocket.on("user-rolled-dice", handleDiceRoll);
    newSocket.on("opponent-select", handleOpponentSelect);
    newSocket.on("opponent-started-game", opponentStartedGame);
    newSocket.on("changed-turn", toastMessage);
    newSocket.on("game-over", toastMessage);
    newSocket.on("on-game-won", (game) => handleGameOver(game, true));
    newSocket.on("user-disconnected", handleOpponentLeft);

    return () => {
      newSocket.off("user-connection", handleUserJoined);
      newSocket.off("user-rolled-dice", handleDiceRoll);
      newSocket.off("opponent-select", handleOpponentSelect);
      newSocket.off("opponent-started-game", opponentStartedGame);
      newSocket.off("changed-turn", toastMessage);
      newSocket.off("game-over", toastMessage);
      newSocket.off("on-game-won");
      newSocket.off("user-disconnected", handleOpponentLeft);
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function tryJoin() {
      const joinSuccessful = await joinGame(username, opponent, socket?.id);
      if (!joinSuccessful) {
        toast.error("Could not join game or game is currently on, try again later.");
      }
    }

    if (socket) {
      tryJoin();
    }
  }, [socket, username, opponent, joinGame]);

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
              {thisTurn._dices && canPlay && <Dice dice={thisTurn._dices} />}
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
          <div style={{ display: "flex", justifyContent: "flex-start", margin: "1em" }}>
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
