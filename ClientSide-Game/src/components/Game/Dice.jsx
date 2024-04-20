<<<<<<< HEAD
import propTypes from 'prop-types';
=======
import React from 'react';
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31

function Dice({ roll }) {
    // roll would be an array with two values, for example: [2, 5]
    return (
        <div className="dice">
            {Array.isArray(roll) && roll.map((value, index) => <div key={index} className={`die die-${value}`}>{value}</div>)}
        </div>
    );
}
<<<<<<< HEAD
Dice.propTypes = {
    roll: propTypes.array.isRequired
}

=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
export default Dice;
