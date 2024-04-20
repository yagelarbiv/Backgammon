<<<<<<< HEAD
import React from 'react';
=======
import propTypes from 'prop-types';
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

<<<<<<< HEAD
function ChatWindow({ name ,messages, currentMessage, setCurrentMessage, handleSendMessage }) {
    return (
        <section className="chat-window">
            <ChatHeader name={name}/>
=======
function ChatWindow({ messages, currentMessage, setCurrentMessage, handleSendMessage }) {
    return (
        <section className="chat-window">
            <ChatHeader />
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
            <MessageList messages={messages} />
            <MessageInput currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} />
        </section>
    );
}

<<<<<<< HEAD
=======

>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
export default ChatWindow;
