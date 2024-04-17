import React from 'react';
import useUserStore from '../../../storage/userStore';

function ChatHeader() {
    const user = useUserStore(state => state.user);

    return (
        <header className="chat-header">
            {user.username} & Yagel
        </header>
    );
}

export default ChatHeader;
