import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function useOnlineServiceSocket() {
    const [allUsers, setAllUsers] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to Socket.IO server
        const newSocket = io(import.meta.env.VITE_APP_ONLINE_URL, {
            autoConnect: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 7000,
        });

        newSocket.on('connect', () => {
            console.log('Socket.IO connection opened');
        });

        newSocket.on('Allusers', (data) => {
            console.log('Data received:', data);
            setAllUsers(data);
        });

        newSocket.on('error', (error) => {
            console.error('Socket.IO error:', error);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
        });

        setSocket(newSocket);

        // Clean up on component unmount
        return () => newSocket.close();
    }, []);

    // Function to send messages as JSON
    const sendJsonMessage = (message) => {
        if (socket) {
            socket.emit('message', message);
        }
    };

    return {
        sendJsonMessage,
        allUsers
    };
}