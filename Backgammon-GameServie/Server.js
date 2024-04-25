import express from "express";
import { createServer } from "http";
import socketIo from "socket.io";

const app = express();
const server = createServer(app);
const io = socketIo(server);

class MainHub {
constructor(chatService, userService) {
    this.chatService = chatService;
    this.userService = userService;
    this.io = io;
}
updateBoard(chat, pieceId, currentPlaceId, nextPlaceId) {
    const lst = [pieceId, currentPlaceId, nextPlaceId];
    this.io.to(chat.ChatId.toString()).emit("UpdateBoard", lst);
}

rollDice(chat) {
    const rnd = Math.floor(Math.random() * 6) + 1;
    this.io.to(chat.ChatId.toString()).emit("GetDice", rnd, rnd);
}

nextTurn(chat, color) {
    const oppositeColor = color === "white" ? "black" : "white";
    this.io.to(chat.ChatId.toString()).emit("Turn", oppositeColor);
}

async endGame(chat, color) {
    if (!chat) return;
    const currentUser = this.userService
    .getUsers()
    .find((x) => x.connectionId === this.io.id);
    const tmp = chat.Users.find((x) => x !== currentUser.username);
    const otherUser = this.userService
    .getUsers()
    .find((x) => x.username === tmp);
    if (
    currentUser.playWith === otherUser.username &&
    otherUser.playWith === currentUser.username
    ) {
    if (color) {
        await this.sendMessage(
        currentUser.username,
        chat,
        `${currentUser.username} won the game.`,
        false
        );
    } else {
        await this.sendMessage(
        currentUser.username,
        chat,
        `${currentUser.username} left the game.`,
        false
        );
    }
    currentUser.playWith = null;
    otherUser.playWith = null;
    this.userService.updateUser(currentUser);
    this.userService.updateUser(otherUser);
    this.io.to(otherUser.username).emit("EndGame");
    this.io.to(currentUser.username).emit("EndGame");
    }
}

async wantToPlayWith(chat) {
    const currentUser = this.userService
    .getUsers()
    .find((x) => x.connectionId === this.io.id);
    const tmp = chat.Users.find((x) => x !== currentUser.username);
    const otherUser = this.userService
    .getUsers()
    .find((x) => x.username === tmp);
    if (currentUser.playWith) {
    this.io
        .to(currentUser.playWith)
        .emit("WantToPlayWithYou", currentUser.username, false);
    }
    currentUser.playWith = otherUser.username;
    this.userService.updateUser(currentUser);
    await this.checkIfCanPlay(currentUser, otherUser, chat);
    this.io
    .to(currentUser.playWith)
    .emit("WantToPlayWithYou", currentUser.username, true);
}

async checkIfCanPlay(currentUser, otherUser, chat) {
    if (
    currentUser.playWith !== otherUser.username ||
    otherUser.playWith !== currentUser.username
    )
    return;
    this.io.join(currentUser.username);
    this.io.join(otherUser.username);
    this.io.to(chat.ChatId.toString()).emit("CanPlay");
    await this.startGame(currentUser, otherUser, chat);
}

async startGame(currentUser, otherUser, chat) {
    this.io.to(currentUser.username).emit("GetColor", "white");
    this.io.to(otherUser.username).emit("GetColor", "black");
    this.io.to(chat.ChatId.toString()).emit("Turn", "white");
}
}

server.listen(5700, () => {
    console.log("Server running on port 3000");
});
