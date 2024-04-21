import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import env from 'dotenv';
import axios from 'axios';
import cookiesMiddleware from 'universal-cookie-express';
import https from 'https';
import http from 'http';
import { Server } from 'socket.io';

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

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
});

app.use(cookiesMiddleware()).use(function (req, res) {
  AccessToken = req.universalCookies.get('AccessToken');
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
    const existingUser = AllUsers.find(exitingUser => exitingUser.name === user.name);
    if (existingUser) {
      user.online = existingUser.online; // or some other logic to update the existing user
    }else{
      user.online = false ;
    }
  });
  AllUsers = dataFromServer;

  
  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('allUsers', AllUsers);
  });

  //  console.log(AllUsers);
}).catch(error => {
  console.error(error);
});




app.use(bodyParser.json());

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


// app.get('/api/users/online-status', async (req, res) => {
//   try {
//     const onlineStatus = await getOnlineStatus();
//     res.json(onlineStatus);
//   } catch (err) {
//     console.error('Error fetching data: ', err);
//     res.status(500).send(err.message);
//   }
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


