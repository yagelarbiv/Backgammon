/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import iconoffine from "../assets/images/icon-offline.png";
import icononline from "../assets/images/icon-online.png";
import useUserStore from "../stores/userStore";
import socketio from "socket.io-client";
import Modal from "./Modal";
import Notification from "./Notification";
import useAuthStore from "../stores/authStore";

function ChatList({ type, items, isItemSelected, handleClick, onListClick, list }) {
    const socket = socketio.connect(import.meta.env.VITE_GAME_URL);
    const [OpenGameInvitedModal, setOpenGameInvitedModal] = useState(false);
    const [otherUser, setOtherUser] = useState(null);
    const user = useUserStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);

    const sendGameInviting = async (otherUser) => {
        setOtherUser(otherUser);
        socket.emit("game-start", (user.userName, otherUser));
    };

    useEffect(() => {
        socket.on("game-start", (otherUser) => {
            setOtherUser(otherUser);
            console.log(otherUser);
            setOpenGameInvitedModal(true);
        })
        socket.on("cancel-invite", () => {
            setOpenGameInvitedModal(false);
        });
        return () => {
            socket.off("game-invite");
            socket.off("cancel-invite");
        };
    }, []);

    const closeGameInvited = () => {
        setOpenGameInvitedModal(false);
        socket.emit("invite-declined", otherUser, user.userName);
    };

    const handleAcceptGame = () => {
        socket.emit("invite-accepted", otherUser, user.userName);
        window.open(
            `http://localhost:5174/game/${user.userName}&${otherUser}?token=${accessToken}`
        );
        setOpenGameInvitedModal(false);
    };

    return (
        <>
            <h2 className="chats-header">{type}</h2>
            {type === 'conversations' && <Modal list={list} onListClick={onListClick} />}
            {OpenGameInvitedModal && <Notification
                otherUser={otherUser}
                onClose={closeGameInvited}
                onAccept={handleAcceptGame} />}
            {items.length > 0 ? (
                items.map((item, index) => (
                    <div className={`chat-item ${isItemSelected(item) ? 'active' : ''}`} key={index}>
                        <button
                            className="chat-button"
                            onClick={() => handleClick(item)}
                        >
                            {item.name}
                            {type === 'users' && <div className={`online-status ${item.online ? 'online' : 'offline'}`}>
                                {item.online ? <img src={icononline} alt={item.name} /> : <img src={iconoffine} alt={item.name} />}
                            </div>}
                        </button>
                        <button data-bs-dismiss="chat-button" onClick={() => sendGameInviting(item.name)}> Ask to a Game</button>
                        <button onClick={() => isItemSelected(item)} data-bs-dismiss="modal">-</button>
                    </div>
                ))
            ) : (
                <p>No Items.</p>
            )}
        </>
    );
}


export default ChatList;