import { useEffect, useState } from "react";
import Connect from "../../components/GameContainer/connect.jsx";
import { MakeBoard } from "../../components/GameContainer/Board.jsx";
import useUserStore from "../../stores/userStore";
import GameLogic from "../../components/GameContainer/GameLogic.jsx";
import './Game.css';

const Game = () => {
  const [connection, setConnection] = useState();
  const [dices, setDices] = useState([0, 0, 0, 0]);
  const [board, setBoard] = useState();
  const [move, setMove] = useState();
  const [color, setColor] = useState();
  const [turn, setTurn] = useState();
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    Connect(
      setTurn,
      setBoard,
      setColor,
      setMove,
      setDices,
      setConnection
    );
    MakeBoard();
  }, []);

  return (
    <div id="game">
      <div className="game">
        <h2>Backgammon Chat</h2>
        <hr className="line" />
        <div className="game">
        <GameLogic
                move={move}
                currentUser={currentUser}
                turn={turn}
                color={color}
                setDices={setDices}
                dices={dices}
                board={board}
                connection={connection}
              ></GameLogic>
        </div>
      </div>
    </div>
  );
};

export default Game;