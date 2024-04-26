import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST"],
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
});
const userToSocketIdMap = {};
io.on("connection", (socket) => {
  console.log("New user connected");

  // Handle client setting their name
  socket.on("set_name", (name) => {
    socket.clientName = name;
    userToSocketIdMap[name] = socket.id; // Corrected variable name here
    socket.emit(
      "message",
      `${socket.clientName} Connected`
    );
  });

socket.on('new_conversation', (data) => {
  const { conversation, otherUserId } = data;
  const otherUserSocketId = userToSocketIdMap[otherUserId];
  if (otherUserSocketId) {
    io.to(otherUserSocketId).emit('conversation_created', conversation);
  }
});

  // Handle message sending
  socket.on("message", (msg) => {
    console.log("message received:", msg);
    io.emit("message-broadcast", msg);
  });




  // Handle addition of items
  socket.on("addItems", (data) => {
    console.log("Items received:", data);
    socket.emit("addItem", { item: data, author: socket.id });
  });

  // Handle manual disconnection
  socket.on("manual_disconnect", () => {
    if (socket.clientName) {
      socket.broadcast.emit(
        "message-broadcast",
        `${socket.clientName} manually disconnected.`
      );
    }
    socket.disconnect();
  });

  // Handle automatic disconnection

  socket.on("disconnect", () => {
    // Remove the mapping when the user disconnects
    const userName = Object.keys(userToSocketIdMap).find(name => userToSocketIdMap[name] === socket.id);
    if (userName) {
      delete userToSocketIdMap[userName];
    }
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});



// import express from "express";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";

// const app = express();
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET","POST"],
//   credentials: true
// }));

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:5000",
//       "http://localhost:5173",
//     ],
//     methods: ["GET", "POST"],
//     credentials: true
//   },
// });

// const userSocketMap = new Map();

// io.on("connection", (socket) => {
//   console.log("New user connected " + socket.id );
  
//   // Handle client setting their name
//   socket.on("set_name", (name) => {
//     userSocketMap.set(socket.clientName, socket.id);
//     socket.clientName = name;
//     socket.emit(
//       "message",
//       socket.clientName
//       ? `${socket.clientName}: ${name} Connected`
//       : "Hello From server!"
//     );
//   });

//   // Handle message sending
//   socket.on("message", (msg) => {
//     console.log("message received:", msg);

//     const {sender, recipient, text} = msg;
//     const senderSocket = io.sockets.sockets.get(sender.socketId);

//     const recipientSocket = io.sockets.sockets.get(recipient.socketId);


//     if (senderSocket && recipientSocket) {
//       senderSocket.emit("message", {sender: sender.name, text: text});
//       recipientSocket.emit("message", {sender: sender.name, text: text});

//     }
//   });

//   socket.on('send_message', (messageData, callback) => {
//     try {
//       const { senderId, text, conversationId } = messageData;
//       const senderSocket = io.sockets.sockets.get(senderId);

//       if (senderSocket) {
//         senderSocket.emit('message-broadcast', messageData);
//       }




//       //callback({ timestamp: new Date() }); // You can add additional data if needed
//     } catch (error) {
//       // Call the callback function with error details
//       callback({ error: 'Message failed to send.' });
//     }
//   });

//   // Handle addition of items
//   socket.on("addItems", (data) => {
//     console.log("Items received:", data);
//     socket.emit("addItem", { item: data, author: socket.id });
//   });

//   // Handle manual disconnection
//   socket.on("manual_disconnect", () => {
//     if (socket.clientName) {
//       socket.broadcast.emit(
//         "message-broadcast",
//         `${socket.clientName} manually disconnected.`
//       );
//     }
//     socket.disconnect();
//   });

//   // Handle automatic disconnection
//   socket.on("disconnect", () => {
//     if (socket.clientName) {
//       userSocketMap.delete(socket.clientName);
//       socket.broadcast.emit(
//         "message-broadcast",
//         `${socket.clientName} has disconnected.`
//       );
//     }
//     console.log("User disconnected");
//   });
// });

// server.listen(5000, () => {
//   console.log("Server is running on port 5000");
// });
