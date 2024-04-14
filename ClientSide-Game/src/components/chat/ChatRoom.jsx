import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const socket = io("http://localhost:5000");

    useEffect(() => {
        // Listening for messages from the server
        socket.on("response", data => {
            console.log(data);
            setMessages(prevMessages => [...prevMessages, data]);
        });

        // Cleanup on component unmount
        return () => socket.disconnect();
    }, []);

    const sendMessage = (message) => {
        socket.emit("message", message);
    };

    return (
        <div>
            {messages.map((msg, index) => (
                <div key={index}>{msg.data}</div>
            ))}
            <button onClick={() => sendMessage("Hello, Server!")}>Send Message</button>
        </div>
    );
};

export default ChatRoom;
