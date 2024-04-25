import io from "socket.io-client";
import CreatBoard from "./Board.jsx";

const Connect = (
  setTurn,
  setBoard,
  setColor,
  setMove,
  setDices,
  setConnection
) => {
  const connection = io("https://localhost:5700");

  connection.on("connect", () => {
    console.log("Connected to server!");
  });

  connection.on("disconnect", () => {
    console.log("Disconnected from server!");
  });

  connection.on("EndGame", () => {
    setBoard(null);
  });

  connection.on("WantToPlayWithYou", (otherUser, flag) => {
    const circle = document.getElementById("C" + otherUser);
    const other = document.getElementById(otherUser);

    if (flag) circle.className = "circle play";
    else if (other.classList.contains("online-user"))
      circle.className = "circle on";
    else circle.className = "circle off";
  });

  connection.on("Turn", (turn) => {
    setTurn(turn);
  });

  connection.on("CanPlay", () => {
    setBoard(CreatBoard());
  });

  connection.on("GetColor", (color) => {
    setColor(color);
  });

  connection.on("UpdateBoard", (move) => {
    setMove(move);
  });

  connection.on("GetDice", (dice1, dice2) => {
    if (dice1 === dice2) setDices([2, dice1, 2, dice2]);
    else setDices([1, dice1, 1, dice2]);

    document.getElementById("firstDice").className = "firstDice dice" + dice1;
    document.getElementById("secondDice").className = "secondDice dice" + dice2;
  });

  setConnection(connection);
  console.log("Connecting completed!");
};

export default Connect;