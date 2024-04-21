import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useOnlineServiceSocket from '../../hooks/useOnlineServiceSocket';

function ChatList({ currentChatId, setCurrentChatId }) {

    // const {allUsers} = useOnlineServiceSocket();
    const allusers = [                                           
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' },
    { id: 4, name: 'Alice Brown' },
    { id: 5, name: 'Mike Davis' },
];
    return (
        <>
            <h2 className="chats-header">Chats</h2>
            {allusers.map((user) => (
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


export default ChatList;