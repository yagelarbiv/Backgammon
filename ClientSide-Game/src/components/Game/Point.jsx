<<<<<<< HEAD
import Checker from './Checker';
import propTypes from 'prop-types';
=======
import React from 'react';
import Checker from './Checker';

>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
function Point({ pointNumber }) {
    // Logic to determine how many checkers are at this point
    return (
        <div className={`point point-${pointNumber}`}>
            {/* You would map over the checkers at this point and render a Checker for each */}
            <Checker />
            {/* Repeat Checker component for each checker on this point */}
        </div>
    );
}
<<<<<<< HEAD
Point.propTypes = {
    pointNumber: propTypes.number
}
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31

export default Point;
