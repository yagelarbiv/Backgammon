import React, { useState, useEffect } from 'react';
import NavBar from '../components/Game/NavBar'
import ChatList from '../components/chat/ChatList'
import './Home.css'
import io from "socket.io-client";


function home() {
    const [users, setUsers] = useState([]);

    const socket = io('http://localhost:5777', { withCredentials: true });


    useEffect(() => {

        socket.on('allUsers', (users) => {
            setUsers(users);
        });
      
        return () => {
            socket.off('allUsers');
        };

    }, []);

  return (
    <>
      <div className="home-page">
        <NavBar/>
        <header>
            <h1 className="title-home">Welcome to Backgammon</h1>
        </header>
        <aside className="sidebar">
          <ChatList allUsers={users}/>
        </aside>
        <div className="button-container">
          <button className='start-game' onClick={() => window.location.href = '/game'}>Start Game</button>
          <button className='join-chat' onClick={() => window.location.href = '/'}>Join Chat</button>
        </div>
      </div>
    </>
  )
}

export default home;