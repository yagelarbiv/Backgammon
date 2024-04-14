import React from 'react';

function ChatMessage({ message }) {
    return (
        <div className={`message ${message.sender === "Elior" ? "sender" : "recipient"}`}>
            <div className="message-info">
                <span className="message-sender">{message.sender}</span>
                <span className="message-timestamp">{message.timestamp}</span>
            </div>
            <div className="message-content">{message.content}</div>
        </div>
    );
}

export default ChatMessage;
