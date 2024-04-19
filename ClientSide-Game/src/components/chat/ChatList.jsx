import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useOnlineServiceSocket from '../../hooks/useOnlineServiceSocket';

function ChatList({ currentChatId, setCurrentChatId }) {

    const {allUsers} = useOnlineServiceSocket();

    return (
        <>
            <h2 className="chats-header">Chats</h2>
            {allUsers.map((user) => (
                <div className={`chat-item ${currentChatId === user.id ? 'active' : ''}`} key={user.id}>
                    <button
                        className="chat-button"
                        onClick={() => setCurrentChatId(user.id)}
                    >
                        {user.name}
                    </button>
                    {/* <img src={user.imageUrl} alt={user.name} /> */}
                </div>
            ))}
        </>
    );
}

ChatList.propTypes = {
    AllUsers: propTypes.array.isRequired,
    currentChatId: propTypes.number.isRequired,
    setCurrentChatId: propTypes.func.isRequired
};

export default ChatList;