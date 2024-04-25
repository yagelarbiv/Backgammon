import express from 'express';
import { createServer } from 'http';
import socketIo from 'socket.io';

const app = express();
const server = createServer(app);
const io = socketIo(server);

class MainHub {
    async updateBoard(chat, pieceId, currentPlaceId, nextPlaceId) {
        const lst = [pieceId, currentPlaceId, nextPlaceId];
        io.to(chat.chatId.toString()).emit('UpdateBoard', lst);
    }

    async rollDice(chat) {
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        io.to(chat.chatId.toString()).emit('GetDice', dice1, dice2);
    }

    async nextTurn(chat, color) {
        const nextColor = color === 'white' ? 'black' : 'white';
        io.to(chat.chatId.toString()).emit('Turn', nextColor);
    }

    async endGame(chat, color) {
        if (!chat) return;

        const currentUser = this.userService.getUsers().find(user => user.connectionId === socketIo.id);
        const tmp = chat.users.find(user => user !== currentUser.username);
        const otherUser = this.userService.getUsers().find(user => user.username === tmp);

        if (currentUser.playWith !== null && currentUser.playWith === otherUser.username && otherUser.playWith === currentUser.username) {
            if (color !== null) this.sendMessage(currentUser.username, chat, `${currentUser.username} won the game.`, false);
            else this.sendMessage(currentUser.username, chat, `${currentUser.username} left the game.`, false);

            currentUser.playWith = null;
            otherUser.playWith = null;
            this.userService.updateUser(currentUser);
            this.userService.updateUser(otherUser);
            io.to(otherUser.username).emit('EndGame');
            io.to(currentUser.username).emit('EndGame');
        }
    }

    async wantToPlayWith(chat) {
        const currentUser = this.userService.getUsers().find(user => user.connectionId === socketIo.id);
        const tmp = chat.users.find(user => user !== currentUser.username);
        const otherUser = this.userService.getUsers().find(user => user.username === tmp);

        if (currentUser.playWith !== null)
            io.to(currentUser.playWith).emit('WantToPlayWithYou', currentUser.username, false);

        currentUser.playWith = otherUser.username;
        this.userService.updateUser(currentUser);
        this.checkIfCanPlay(currentUser, otherUser, chat);
        io.to(currentUser.playWith).emit('WantToPlayWithYou', currentUser.username, true);
    }

    async checkIfCanPlay(currentUser, otherUser, chat) {
        if (!(currentUser.playWith === otherUser.username && otherUser.playWith === currentUser.username)) return;

        io.to(currentUser.username).emit('CanPlay');
        io.to(otherUser.username).emit('CanPlay');
        io.in(chat.chatId.toString()).emit('CanPlay');
        this.startGame(currentUser, otherUser, chat);
    }

    async startGame(currentUser, otherUser, chat) {
        io.to(currentUser.username).emit('GetColor', 'white');
        io.to(otherUser.username).emit('GetColor', 'black');
        io.in(chat.chatId.toString()).emit('Turn', 'white');
    }
}

io.on('connection', (socket) => {
    console.log('New client connected');
    const mainHub = new MainHub(new ChatService(), new UserService());

    socket.on('UpdateBoard', (chat, pieceId, currentPlaceId, nextPlaceId) => {
        mainHub.updateBoard(chat, pieceId, currentPlaceId, nextPlaceId);
    });

    socket.on('RollDice', (chat) => {
        mainHub.rollDice(chat);
    });

    socket.on('NextTurn', (chat, color) => {
        mainHub.nextTurn(chat, color);
    });

    socket.on('EndGame', (chat, color) => {
        mainHub.endGame(chat, color);
    });

    socket.on('WantToPlayWith', (chat) => {
        mainHub.wantToPlayWith(chat);
    });

    socket.on('CheckIfCanPlay', (currentUser, otherUser, chat) => {
        mainHub.checkIfCanPlay(currentUser, otherUser, chat);
    });

    socket.on('StartGame', (currentUser, otherUser, chat) => {
        mainHub.startGame(currentUser, otherUser, chat);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5700;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
