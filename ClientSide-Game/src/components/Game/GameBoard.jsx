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
