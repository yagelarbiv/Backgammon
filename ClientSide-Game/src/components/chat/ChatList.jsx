import React, { useEffect, useState } from 'react';
import useAllUsersStore from '../../../storage/useAllUsersStore';
import iconoffine from './../../assets/icon-offline.png';
import icononline from './../../assets/icon-online.png';
function ChatList({ currentChatId, setCurrentChatId }) {

    const allUsers = useAllUsersStore((state) => state.allUsers);

    
    useEffect(() => {
        console.log("ChatList allUsers:", allUsers)
    }, [allUsers]);
    
    return (
        <>
            <h2 className="chats-header">Users</h2>
            {allUsers.length > 0 ? (
                allUsers.map((user) => (
                <div className={`chat-item ${currentChatId === user.id ? 'active' : ''}`} key={user.id}>
                    <button
                        className="chat-button"
                        onClick={() => setCurrentChatId(user.id)}
                    >
                        {user.name}
                    <div className={`online-status ${user.online ? 'online' : 'offline'}`}>
                        {user.online ? <img src={icononline} alt={user.name} />  : <img src={iconoffine} alt={user.name} />}
                    </div>
                    </button>
                      
                </div>
            ))
            ) : (
                <p>No users found.</p>
            )}
        </>
    );
}


export default ChatList;