import { useState, useEffect, useMemo } from "react";
import socketio from "socket.io-client";
import Modal from "./Modal";
import Notification from "./Notification";
import useUserStore from "../stores/userStore";
import useAuthStore from "../stores/authStore";
import useConversationStore from "../stores/conversetionStore";
import useAllUsersStore from "../stores/allUsersStore";

function ChatList({ type, items, isItemSelected, handleClick, onListClick, list,deleteChat }) {
    const [socket, setSocket] = useState(null);
    const [OpenGameInvitedModal, setOpenGameInvitedModal] = useState(false);
    const [otherUser, setOtherUser] = useState(null);
    const { hasUnreadMessages, sethasUnreadMessages } = useConversationStore();
    const { allUsers, setAllUsers } = useAllUsersStore();
    const toggleUnread = () => {
        if (hasUnreadMessages ) {
            sethasUnreadMessages(!hasUnreadMessages);
        }
    }
    const user = useUserStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const deleteConversation = useConversationStore((state) => state.deleteConversation);

    const sortedItems = useMemo(() => {
        const onlineUsers = items.filter(user => user.online);
        const offlineUsers = items.filter(user => !user.online);
        return [...onlineUsers, ...offlineUsers];
    }, [items]);

    useEffect(() => {
        const newSocket = socketio('http://localhost:3003', {
            withCredentials: true,
            transports: ['websocket'] 
        });
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, []);

    const handleDelete = (itemToDelete, event) => {
        event.stopPropagation();
        deleteChat(itemToDelete._id);
    };

    const sendGameInviting = async (otherUser, e) => {
        console.log("Invited user:", otherUser);
        e.stopPropagation();
        setOtherUser(otherUser);
        if (socket) {
            socket.emit("game-start", user.userName, otherUser);
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
                console.log("Game created:", newGame);
                // newGame._gameOn = true;
                window.open(
                    `http://localhost:5174/game/${user.userName}&${otherUser}?token=${accessToken}`
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
            {sortedItems.length > 0 ? (
                
                sortedItems.map((item, index) => (
                    <div onClick={toggleUnread} className={`chat-item ${isItemSelected(item) ? 'active' : ''}`} key={item.id || index}>
                        <button className="chat-button" onClick={() => handleClick(item)}>
                            {type === 'conversations' && item.members && item.members.length > 1 && (
                                <>
                                    <span>{item.members[0]}</span>
                                    <button data-bs-dismiss="chat-button" onClick={(e) => sendGameInviting(item.members[1], e)}>Request Game</button>
                                    <button className="" onClick={(e) => handleDelete(item, e)}>
                                        <i className="bi bi-person-x-fill"></i>
                                    </button>
                                    {hasUnreadMessages && <span className="unread-indicator"></span>} 
                                </>
                            )}
                            {type === 'users' && (
                                <>
                                <div className={`online-status ${item.online ? 'online' : 'offline'}`}>
                                    {item.online ? <i className="bi bi-person-check"></i> : <i className="bi bi-person-dash"></i>}
                                    {item.name}
                                    {/* <img src={item.online ? icononline : iconoffline} alt={item.name} /> */}
                                </div>
                                </>
                            )}
                            { type === 'game' && (
                                <div className={`online-status`}>
                                     {item.online ? <i className="bi bi-person-check"></i> : <i className="bi bi-person-dash"></i>}
                                     {item.name}
                                     {/* { <img src={item.online ? icononline : iconoffline} alt={item.name} /> } */}
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