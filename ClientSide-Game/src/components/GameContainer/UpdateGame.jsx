import React from 'react';

const UpdateGame = ({ color, turn, move, dices, setDices, connection, chat }) => {
  const handleUpdateGame = () => {
    const currentId = parseInt(move[1].match(/\d+/));
    const nextId = parseInt(move[2].match(/\d+/));
    const piece = <div id={move[0]} />;
    const currentPlace = <div id={move[1]} />;
    const nextPlace = <div id={"T" + move[2].match(/\d+/)} />;
    const midPart = <div id="MidPart" />;

    if (move[2] === "pieceOut") {
      // Handle piece moving out
      setDices(prevDices => {
        let updatedDices = [...prevDices];
        if (piece.props.className === "black piece") {
          if (updatedDices[1] === 25 - currentId && updatedDices[0] > 0) updatedDices[0]--;
          else if (updatedDices[3] > 25 - currentId && updatedDices[2] > 0) updatedDices[2]--;
          else if (updatedDices[3] === 25 - currentId && updatedDices[2] > 0) updatedDices[2]--;
          else if (updatedDices[1] > 25 - currentId && updatedDices[0] > 0) updatedDices[0]--;
          piece.props.className = "none";
        }
        if (piece.props.className === "white piece") {
          if (updatedDices[1] === currentId && updatedDices[0] > 0) updatedDices[0]--;
          else if (updatedDices[3] > currentId && updatedDices[2] > 0) updatedDices[2]--;
          else if (updatedDices[3] === currentId && updatedDices[2] > 0) updatedDices[2]--;
          else if (updatedDices[1] > currentId && updatedDices[0] > 0) updatedDices[0]--;
          piece.props.className = "none";
        }
        return updatedDices;
      });

      checkDices(connection, chat, dices, color, turn);
      return;
    }

    if (move[1] === "MidPart") {
      // Handle moving from MidPart
      setDices(prevDices => {
        let updatedDices = [...prevDices];
        if (piece.props.className === "black") {
          if (nextId === updatedDices[1] && updatedDices[0] > 0) updatedDices[0]--;
          else if (nextId === updatedDices[3] && updatedDices[2] > 0) updatedDices[2]--;
        }
        if (piece.props.className === "white") {
          if (25 - nextId === updatedDices[1] && updatedDices[0] > 0) updatedDices[0]--;
          else if (25 - nextId === updatedDices[3] && updatedDices[2] > 0) updatedDices[2]--;
        }
        return updatedDices;
      });

      checkDices(connection, chat, dices, color, turn);
    } else {
      // Handle regular move
      setDices(prevDices => {
        let updatedDices = [...prevDices];
        if (piece.props.className === "black piece") {
          if (nextId - currentId === updatedDices[1] && updatedDices[0] > 0) updatedDices[0]--;
          else if (nextId - currentId === updatedDices[3] && updatedDices[2] > 0) updatedDices[2]--;
        }
        if (piece.props.className === "white piece") {
          if (currentId - nextId === updatedDices[1] && updatedDices[0] > 0) updatedDices[0]--;
          else if (currentId - nextId === updatedDices[3] && updatedDices[2] > 0) updatedDices[2]--;
        }
        return updatedDices;
      });

      checkDices(connection, chat, dices, color, turn);
    }

    // Go to empty
    if (nextPlace.children && nextPlace.children.length === 1) {
      nextPlace.props.children = [...nextPlace.props.children, piece];
      return;
    }

    // Go to the same color
    if (piece.props.className === nextPlace.props.children[1].props.className) {
      nextPlace.props.children = [...nextPlace.props.children, piece];
      return;
    }

    // Eat 1 in the other color
    if (nextPlace.children && nextPlace.children.length === 2) {
      midPart.props.children = [...midPart.props.children, nextPlace.children[1]];
      nextPlace.props.children = [...nextPlace.props.children, piece];
    }
  };

  const checkDices = (connection, chat, dices, color, turn) => {
    if (connection && dices && chat) {
      if (dices[0] === 0 && dices[2] === 0) {
        connection.invoke("RollDice", chat);
        if (color === turn) connection.invoke("NextTurn", chat, color);
      }
    }
  };

  return <button onClick={handleUpdateGame}>Update Game</button>;
};

export default UpdateGame;
