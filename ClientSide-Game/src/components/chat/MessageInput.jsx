import React from 'react';

function MessageInput({ currentMessage, setCurrentMessage, handleSendMessage }) {
    return (
        <div className="message-input">
            <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Write a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default MessageInput;
