import { useState, useEffect, useCallback } from "react";
import iconoffline from "../assets/images/icon-offline.png";
import icononline from "../assets/images/icon-online.png";
import useUserStore from "../stores/userStore";
import socketio from "socket.io-client";
import Modal from "./Modal";
import Notification from "./Notification";
import useAuthStore from "../stores/authStore";
import useConversationStore from "../stores/conversetionStore";
import useAllUsersStore from '../stores/allUsersStore';

function ChatList({ type, items, isItemSelected, handleClick, onListClick, list }) {
    const [socket, setSocket] = useState(null);
    const [OpenGameInvitedModal, setOpenGameInvitedModal] = useState(false);
    const [otherUser, setOtherUser] = useState(null);
    const user = useUserStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const deleteConversation = useConversationStore((state) => state.deleteConversation);
    const allUsers = useAllUsersStore((state) => state.allUsers);

    useEffect(() => {
        const newSocket = socketio.connect('http://localhost:3003');
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    const handleDelete = useCallback((itemToDelete, event) => {
        event.stopPropagation();
        deleteConversation(itemToDelete.id);
    }, [deleteConversation]);

    const sendGameInviting = useCallback((OtherUser, e) => {
        console.log("Invited user:", OtherUser);
        e.stopPropagation();
        socket.emit("game-start", user.userName, OtherUser, allUsers);
    }, [socket, user.userName, allUsers]);

    useEffect(() => {
        if (socket) {
            socket.on("game-invite", (OtherUser) => {
                console.log(OtherUser);
                setOtherUser(OtherUser);
                console.log(`setting otherUser to ${otherUser}`);
                setOpenGameInvitedModal(true);
            });
            socket.on("cancel-invite", () => {
                setOpenGameInvitedModal(false);
            });
            return () => {
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
        window.open(`http://localhost:5174/game/${encodeURIComponent(user.userName)}&${encodeURIComponent(otherUser)}?token=${encodeURIComponent(accessToken)}`);
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
                                    <>
                                        {item.name}
                                        <img src={item.online ? icononline : iconoffline} alt={item.name} />
                                    </>
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