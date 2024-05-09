import { useState, useEffect } from "react";
import useAllUsersStore from '../../stores/allUsersStore';
import useUserStore from '../../stores/userStore';
import useAuthStore from '../../stores/authStore';
import ChatList from "../../components/ItemList";
import socketio from "socket.io-client";
import Notification from "../../components/Notification";
import './Game.css';

function Game() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [OpenGameInvitedModal, setOpenGameInvitedModal] = useState(false);
    const { allUsers } = useAllUsersStore();
    const user = useUserStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        const newSocket = socketio('http://localhost:3003', {
            withCredentials: true,
            transports: ['websocket']
        });
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, []);

    const sendGameInviting = async (selected) => {
        console.log("Invited user:", selected.name);
        setSelectedUser(selected.name);
        console.log(user.userName);
        if (socket) {
            socket.emit("game-start", user.userName, selectedUser.name);
        }
    };

    useEffect(() => {
        if (socket) {
            socket.emit("connection", () => {
                console.log("Connected to server");
            });
            socket.emit("set_name", user.userName);
            socket.on("game-invite", (selectedUser) => {
                setSelectedUser(selectedUser);
                console.log("Game invite:", selectedUser);
                setOpenGameInvitedModal(true);
            });
            socket.on('game_created', (User) => {
                console.log("Game created:", User);
                window.open(
                    `http://localhost:5174/game/${user.userName}&${User}?token=${accessToken}`
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
        socket.emit("invite-declined", selectedUser, user.userName);
    };

    const handleAcceptGame = () => {
        socket.emit("invite-accepted", selectedUser, user.userName);
        window.open(
            `http://localhost:5174/game/${user.userName}&${selectedUser}?token=${accessToken}`
        );
        socket.emit("new_game", selectedUser,user.userName);
        setOpenGameInvitedModal(false);
    };

    const handleUserClick = (user) => {
        console.log('User clicked:', user.name);
        setSelectedUser(user);
    };

    return (
        <>
            <div className="home-page-game">
                <div className="central-container-game">
                    <h1 className="title-game">Welcome to Backgammon - Game</h1>
                    <aside className="sidebar-game">
                        <ChatList
                            type="game"
                            items={allUsers}
                            isItemSelected={(user) => user === selectedUser}
                            handleClick={handleUserClick}
                        />
                    </aside>
                    <div className="game-container-right">
                        <div className="game">
                            {selectedUser && !OpenGameInvitedModal && (
                                <div>
                                    <h2>{selectedUser.name}</h2>
                                    <button
                                        onClick={() => sendGameInviting(selectedUser)}
                                    >
                                        Invite
                                    </button>
                                </div>
                            )}
                            {
                                OpenGameInvitedModal && 
                                    <div className="notification">
                                    <Notification otherUser={selectedUser} 
                                    onClose={closeGameInvited} 
                                    onAccept={handleAcceptGame} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Game;
