<<<<<<< HEAD
import React from 'react';
=======
/* eslint-disable react/prop-types */

import useUserStore from '../../../storage/userStore';
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31

function ChatMessage({ message }) {
    const name = message.split(':')[0]
    const content = message.split(':')[1]
    const timestamp = Date.now()
    const date = new Date(timestamp)
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
<<<<<<< HEAD
    
    return (
        <div className={`message ${name === "Elior" ? "sender" : "recipient"}`}>
=======
    const user = useUserStore(state => state.user);
    
    return (
        <div className={`message ${name === user ? "sender" : "recipient"}`}>
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
            
            <div className="message-info">
                <span className="message-sender">{name}</span>
                <span className="message-timestamp">{formattedDate}</span>
            </div>
            <div className="message-content">{content}</div>
        </div>
    );
}

export default ChatMessage;
