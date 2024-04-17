import React from 'react';
import Point from './Point';

function Board() {
    // You would have logic here to create 24 points for the board
    return (
        <div className="board">
            {/* You would map over your points state and render a Point component for each */}
            {/* Example: */}
            {[...Array(24)].map((_, index) => <Point key={index} pointNumber={index + 1} />)}
        </div>
    );
}

export default Board;
