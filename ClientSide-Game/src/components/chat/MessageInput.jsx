<<<<<<< HEAD
import React from 'react';

function MessageInput({ currentMessage, setCurrentMessage, handleSendMessage }) {
=======
import propTypes from 'prop-types';

function MessageInput({ currentMessage, setCurrentMessage, handleSendMessage }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && currentMessage.trim() !== '') {
            handleSendMessage();
        }
    };
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
    return (
        <div className="message-input">
            <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
<<<<<<< HEAD
=======
                onKeyDown={handleKeyPress}
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
                placeholder="Write a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default MessageInput;
