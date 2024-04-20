<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
import Board from './Board';
import Dice from './Dice';
import './GameBoard.css'; // Make sure to create corresponding CSS for styling

function GameBoard() {
    // You would have state and functions to handle the logic of the game here
    return (
        <div className="game-board">
            <Board />
            <Dice />
        </div>
    );
}

export default GameBoard;
