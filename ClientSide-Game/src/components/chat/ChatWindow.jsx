import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatWindow({ name ,messages, currentMessage, setCurrentMessage, handleSendMessage }) {
    return (
        <section className="chat-window">
            <ChatHeader name={name}/>
            <MessageList messages={messages} />
            <MessageInput currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} />
        </section>
    );
}

export default ChatWindow;