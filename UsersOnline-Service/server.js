import express from 'express';
import cors from 'cors';
import axios from 'axios';
import https from 'https';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import "dotenv/config";


const app = express();
const PORT = process.env.PORT || 5777; //5777
// const onlineUsers = {};
let allUsers = [];
let AccessToken;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});


const getUserNameFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  } catch (error) {
    console.error("Failed to decode or verify JWT:", error);
    return null;
  }
};

io.use((socket, next) => {

  const token = socket.handshake.auth.token;
  if (token) {
    const userName = getUserNameFromToken(token);
    if (userName) {
      console.log("Authenticated user:", userName);
      const user = allUsers.find(user => user.name === userName);
      if (user) {
        user.online = true;
        user.socketConnection = socket;
      }
      else{
        allUsers.push({ name: userName, online: true , socketConnection: socket});
      }

      for(const user of allUsers){
        if(user.online && user.socketConnection){
          user.socketConnection.emit('allUsers', allUsers);
        }
      }
      
      return next();

    }
  }
  else
  {    
    const err = new Error("Authentication error");
    err.data = { content: "Please retry later" }; // Additional error data
    next(err);
  }
});


io.on('connection', (socket) => {
  console.log('A user connected' );
  socket.emit('allUsers', allUsers);
});



axios.get('https://localhost:6001/api/auth/all-users', {
  headers: {
    'Authorization': `Bearer ${AccessToken}` 
  },
  withCredentials: true,
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
}).then(response => {
  const dataFromServer = response.data.map(user => ({ name: user, online: false }));
  dataFromServer.forEach(user => {
    const existingUser = allUsers.find(exitingUser => exitingUser.name === user.name);
    if (existingUser) {
      user.online = existingUser.online; 
    }else{
      user.online = false ;
    }
  });
  allUsers = dataFromServer;
  console.log(allUsers);
}).catch(error => {
  console.error(error);
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


