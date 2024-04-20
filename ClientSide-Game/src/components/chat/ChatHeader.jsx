<<<<<<< HEAD
import React from 'react';

function ChatHeader() {
    return (
        <header className="chat-header">
            Elior & Yagel
=======
import useUserStore from '../../../storage/userStore';

function ChatHeader() {
    const user = useUserStore(state => state.user);
    console.log(user);
    return (
        <header className="chat-header">
            {user.userName}'s Global chat 
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
        </header>
    );
}

export default ChatHeader;
