import React, { useState } from 'react';
import useAllUsersStore from '../../stores/allUsersStore';
import ChatList from "../../components/ItemList";
import './Game.css';

function Game() {
    const allUsers = useAllUsersStore((state) => state.allUsers);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserClick = (user) => {
        console.log('User clicked:', user.name);
        setSelectedUser(user);
    };

    const sendGameInviting = (user) => {
        console.log('Game invitation sent to:', user);
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
                            {selectedUser && (
                                <div>
                                    <h2>{selectedUser.name}</h2>
                                    <button
                                        onClick={() => sendGameInviting(selectedUser)}
                                    >
                                        Invite
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Game;
