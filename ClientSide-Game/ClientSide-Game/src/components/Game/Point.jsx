import React from 'react';
import Checker from './Checker';

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

export default Point;
