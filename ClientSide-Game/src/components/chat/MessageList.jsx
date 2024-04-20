<<<<<<< HEAD
import React from 'react';
=======
import propTypes from 'prop-types';
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
import ChatMessage from './ChatMessage';

function MessageList({ messages }) {

    return (
        <div className="message-list">
            {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
            ))}
        </div>
    );
}

<<<<<<< HEAD
=======

>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
export default MessageList;
