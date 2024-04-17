import propTypes from 'prop-types';

function Dice({ roll }) {
    // roll would be an array with two values, for example: [2, 5]
    return (
        <div className="dice">
            {Array.isArray(roll) && roll.map((value, index) => <div key={index} className={`die die-${value}`}>{value}</div>)}
        </div>
    );
}
Dice.propTypes = {
    roll: propTypes.array.isRequired
}

export default Dice;
