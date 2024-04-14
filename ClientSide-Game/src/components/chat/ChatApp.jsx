import React, { useState } from 'react';
import './ChatApp.css';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

function ChatApp() {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messages, setMessages] = useState([{ sender: "Elior", content: "Hey dudes!!", timestamp: "14/4/2024, 10:01:38 PM" }]);

    const handleSendMessage = () => {
        const newMessage = {
            sender: "username", // This should be replaced with the current user's name
            content: currentMessage,
            timestamp: new Date().toLocaleString()
        };
        setMessages([...messages, newMessage]);
        setCurrentMessage("");
    };

    return (
        <div className="chat-app">
            <aside className="sidebar">
                <ChatList />
            </aside>
            <ChatWindow messages={messages} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} />
        </div>
    );
}

export default ChatApp;
