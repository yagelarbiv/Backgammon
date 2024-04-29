import { useState, useEffect } from "react";
import socketio from "socket.io-client";
import Modal from "./Modal";
import Notification from "./Notification";
import useUserStore from "../stores/userStore";
import useAuthStore from "../stores/authStore";
import useConversationStore from "../stores/conversetionStore";
import iconoffline from "../assets/images/icon-offline.png";
import icononline from "../assets/images/icon-online.png";

function ChatList({ type, items, isItemSelected, handleClick, onListClick, list }) {
    const [socket, setSocket] = useState(null);
    const [OpenGameInvitedModal, setOpenGameInvitedModal] = useState(false);
    const [otherUser, setOtherUser] = useState(null);
    const user = useUserStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    // let refreshToken = useAuthStore((state) => state.refreshToken);
    const deleteConversation = useConversationStore((state) => state.deleteConversation);
    useEffect(() => {
        const newSocket = socketio('http://localhost:3003', {
            withCredentials: true,
            transports: ['websocket']  // Ensuring to use WebSockets
        });
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, []);

    const handleDelete = (itemToDelete, event) => {
        event.stopPropagation();
        deleteConversation(itemToDelete.id);
    };

    const sendGameInviting = async (otherUser, e) => {
        console.log("Invited user:", otherUser);
        e.stopPropagation();
        setOtherUser(otherUser);
        if (socket) {
            socket.emit("game-start", user.userName, otherUser);
            // window.open(
            //     `http://localhost:5174/game/${otherUser}&${user.userName}?token=${accessToken}`
            // );
        }
    };

    useEffect(() => {
        if (socket) {
        socket.emit("connection", () => {
            console.log("Connected to server");
        });
        socket.emit("set_name", user.userName);
            socket.on("game-invite", (otherUser) => {
                setOtherUser(otherUser);
                setOpenGameInvitedModal(true);
            });
            socket.on('game_created', (newGame) => {
                window.open(
                    `${newGame}`
                );
            });
            socket.on("cancel-invite", () => {
                setOpenGameInvitedModal(false);
            });

            return () => {
                socket.off("game_created");
                socket.off("game-invite");
                socket.off("cancel-invite");
            };
        }
    }, [socket]);

    const closeGameInvited = () => {
        setOpenGameInvitedModal(false);
        socket.emit("invite-declined", otherUser, user.userName);
    };

    const handleAcceptGame = () => {
        socket.emit("invite-accepted", otherUser, user.userName);
        window.open(
            `http://localhost:5174/game/${user.userName}&${otherUser}?token=${accessToken}`
        );
        socket.emit("new_game", otherUser, `http://localhost:5174/game/&${otherUser}${user.userName}?token=${accessToken}`);
        setOpenGameInvitedModal(false);
    };

    return (
        <>
            <h2 className="chats-header">{type}</h2>
            {type === 'conversations' && <Modal list={list} onListClick={onListClick} />}
            {OpenGameInvitedModal && <Notification otherUser={otherUser} onClose={closeGameInvited} onAccept={handleAcceptGame} />}
            {items.length > 0 ? (
                items.map((item, index) => (
                    <div className={`chat-item ${isItemSelected(item) ? 'active' : ''}`} key={item.id || index}>
                        <button className="chat-button" onClick={() => handleClick(item)}>
                            {type === 'conversations' && item.users && item.users.length > 1 && (
                                <>
                                    <span>{item.users[1].name}</span>
                                    <button className="btn btn-danger" onClick={(e) => handleDelete(item, e)}>-</button>
                                    <button data-bs-dismiss="chat-button" onClick={(e) => sendGameInviting(item.users[1].name, e)}>Ask to a Game</button>
                                </>
                            )}
                            {type === 'users' && (
                                <div className={`online-status ${item.online ? 'online' : 'offline'}`}>
                                    {item.name}
                                    <img src={item.online ? icononline : iconoffline} alt={item.name} />
                                </div>
                            )}
                        </button>
                    </div>
                ))
            ) : (
                <p>No Items.</p>
            )}
        </>
    );
}

export default ChatList;