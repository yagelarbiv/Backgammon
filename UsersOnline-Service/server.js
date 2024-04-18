import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import env from 'dotenv';
import ClientSocketIO from 'socket.io-client';
import axios from 'axios';
import cookiesMiddleware from 'universal-cookie-express';
import https from 'https';

env.config();

const app = express();
const PORT = process.env.PORT || 5777;
const socketClient = ClientSocketIO('https://localhost:6001/api/auth');
let onlineUsers = {};
let AllUsers = [];
let AccessToken = '';
app.use(cors({
    origin: "https://localhost:6001/api/auth",
    methods: ["GET","POST"],
    credentials: true
}));

app.use(bodyParser.json());

app.use(cookiesMiddleware()).use(function (req, res) {
  // get the user cookies using universal-cookie
  AccessToken = req.universalCookies.get('AccessToken');
});

axios.get('https://localhost:6001/api/auth/AllUsers', {
    headers: {
        'Authorization': `Bearer ${AccessToken}` 
    },
    withCredentials: true,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Disable SSL verification
  }).then(response => {
    console.log(response.data);
    AllUsers = response.data;
  }).catch(error => {
    console.error(error);
  });

socketClient.on("connect", () => {
    console.log(`Connected to socket.io server as client with id ${socketClient.id}`);
    // Assuming we have a way to get the username (perhaps from a login event)
    // Let's say the username is stored in a variable called `username`
    const username = socketClient.id; // Replace this with actual logic to get the username
    onlineUsers[username] = true; // Set the user's status to online
    
});

socketClient.on("disconnect", () => {
    console.log(`User disconnected with id ${socketClient.id}`);
    // Assuming we can still access the username when the user disconnects
    const username = "some_username"; // Replace this with actual logic to get the username
    onlineUsers[username] = false; // Set the user's status to offline
});


socketClient.on('login', (username) => {
    onlineUsers[username] = true;
    io.emit("online_status", onlineUsers); // Emit the status to all users
});

socketClient.on('disconnect', () => {
    // Find the username associated with this socket
    const username = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
    if (username) {
        onlineUsers[username] = false;
        io.emit("online_status", onlineUsers); // Emit the status to all users
    }
});


// Function to get the online status of users
const getOnlineStatus = () => {
  // Return the dictionary of online users
  return onlineUsers;
}

setInterval(() => {
  const onlineStatus = getOnlineStatus();
  console.log(onlineStatus);   
  socketClient.emit("online_status", onlineStatus);
},2000)


// API route to get online status of users
app.get('/api/users/online-status', async (req, res) => {
  try {
      // Call the function to get the online status of users
    const onlineStatus = await getOnlineStatus();
    res.json(onlineStatus);
    } catch (err) {
      // Log and return the error
    console.error('Error fetching data: ', err);
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});