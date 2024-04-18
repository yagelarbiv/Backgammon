import React, { useEffect, useState } from 'react';
import axios from 'axios';
impo


function ChatList({ currentChatId, setCurrentChatId }) {
    const [AllUsers, setAllUsers] = useState([]);
    const allUsers = async () =>{
       const AllUsers = await axios.get(import.meta.env.VITE_APP_ONLINE_URL)
       console.log(AllUsers.data)
       setAllUsers(AllUsers.data)
    }
    useEffect(() => {
        allUsers();
    }, []);
    return (
        <>
            <h2 className="chats-header">Chats</h2>
            {AllUsers.map((user) => (
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