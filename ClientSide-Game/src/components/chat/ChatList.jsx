/* eslint-disable react/prop-types */
import useOnlineServiceSocket from '../../hooks/useOnlineServiceSocket';

function ChatList({ currentChatId, setCurrentChatId }) {

    const {allUsers} = useOnlineServiceSocket();

    return (
        <>
            <h2 className="chats-header">Chats</h2>
            {allUsers.map((user) => (
                <div className={`chat-item ${currentChatId === user.id ? 'active' : ''}`} key={user.id}>
                    <button
                        className="chat-button"
                        onClick={() => setCurrentChatId(user.id)}
                    >
                        {user.name}
                    </button>
                    {/* <img src={user.imageUrl} alt={user.name} /> */}
                </div>
            ))}
        </>
    );
}

export default ChatList;
