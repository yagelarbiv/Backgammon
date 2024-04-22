import useUserStore from '../../../storage/userStore';

function ChatHeader() {
    const user = useUserStore(state => state.user);
    return (
        <header className="chat-header">
            {user.userName}'s Global chat 
        </header>
    );
}

export default ChatHeader;
