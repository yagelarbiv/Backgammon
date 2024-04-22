import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import axios from 'axios';
import cookiesMiddleware from 'universal-cookie-express';
import https from 'https';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import "dotenv/config";
import cookieParser from 'cookie-parser';


env.config();

const app = express();
const PORT = process.env.PORT || 5777;
// const onlineUsers = {};
let AllUsers = [];
let AccessToken;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(cookieParser());

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  cookies: {
    cookieName: 'AccessToken',
    secret: process.env.SECRET_JWT
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('allUsers', AllUsers);
});

// const getUserNameFromToken = (token) => {
//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_JWT);
//     return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
//   } catch (error) {
//     console.error("Failed to decode or verify JWT:", error);
//     return null;
//   }
// };

// io.use((socket,next) => {
//   const token = socket.handshake.headers.cookie?.split('; ')
//     .find(cookie => cookie.startsWith('AccessToken='))
//     ?.split('=')[1];
//   console.log(socket.handshake.headers.cookie);
//   const userName = getUserNameFromToken(token);
//   console.log(userName);
//   next();
// })

axios.get('https://localhost:6001/api/auth/all-users', {
  headers: {
    'Authorization': `Bearer ${AccessToken}` 
  },
  withCredentials: true,
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
}).then(response => {
  const dataFromServer = response.data.map(user => ({ name: user, online: false }));
  dataFromServer.forEach(user => {
    const existingUser = AllUsers.find(exitingUser => exitingUser.name === user.name);
    if (existingUser) {
      user.online = existingUser.online; // or some other logic to update the existing user
    }else{
      user.online = false ;
    }
  });
  AllUsers = dataFromServer;
  console.log(AllUsers);
}).catch(error => {
  console.error(error);
});



// socketClient.on('disconnect', () => {
//   const username = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
//   if (username) {
//     const userIndex = AllUsers.findIndex(user => user.name === username);
//     if (userIndex !== -1) {
//       AllUsers[userIndex].online = false;
//       io.emit("online_status", AllUsers); // Emit the updated user list
//     }
//   }
// });


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


