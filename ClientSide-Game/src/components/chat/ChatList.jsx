import propTypes from 'prop-types';

function ChatList({ AllUsers, currentChatId, setCurrentChatId }) {
    return (
        <>
            <h2 className="chats-header">Chats</h2>
            {AllUsers.map((user) => (
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

ChatList.propTypes = {
    AllUsers: propTypes.array.isRequired,
    currentChatId: propTypes.number.isRequired,
    setCurrentChatId: propTypes.func.isRequired
};

export default ChatList;