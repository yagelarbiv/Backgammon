import React, { useState, useEffect } from 'react';
import NavBar from '../components/Game/NavBar'
import ChatList from '../components/chat/ChatList'
import './Home.css'
import {io} from "socket.io-client";
import useAllUsersStore from './../../storage/useAllUsersStore';

function Home() {
  const allUsers = useAllUsersStore((state) => state.allUsers);
  const setAllUsers = useAllUsersStore((state) => state.setAllUsers);
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const newSocket = io('http://localhost:5777', { withCredentials: true });
        setSocket(newSocket);
        return () => newSocket && newSocket.close();
    }, []);

    useEffect(() => {
      if (!socket) return;
      socket.on("allUsers", (users) => {
        console.log("Received users from socket:", users);
        setAllUsers(users);

      });
      return () => {
        socket.off("allUsers");
    };
    }, [socket,setAllUsers]);

  return (
    <>
      <div className="home-page">
        <NavBar/>
          <h1 className="title-home">Welcome to Backgammon</h1>
        <aside className="sidebar">
          <ChatList allUsers={allUsers}/>
          
        </aside>
        <div className="button-container">
          <button className='start-game' onClick={() => window.location.href = '/game'}>Start Game</button>
          <button className='join-chat' onClick={() => window.location.href = '/'}>Join Chat</button>
        </div>
      </div>
    </>
  )
}

export default Home;