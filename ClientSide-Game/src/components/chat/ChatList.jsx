import React from 'react';
import ChatWindow from './ChatWindow';

function ChatList(name ,messages, currentMessage, setCurrentMessage, handleSendMessage) {


    return (
        <>
            <h2 className="chats-header">Chats</h2>
            <div className="chat-item">
                <button className="chat-button" onClick={() => {<ChatWindow messages={messages} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} handleSendMessage={handleSendMessage} />}}>
                    Chat User 1
                </button>
                <img src="" alt="" />
            </div>

        </>
    );
}

export default ChatList;
