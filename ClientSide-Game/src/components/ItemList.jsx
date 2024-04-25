import iconoffine from "../assets/icon-offline.png";
import icononline from "../assets/icon-online.png";
import Modal from "./Modal";

function ChatList({  type,items,isItemSelected,handleClick,onListClick,list }) {
   
    return (
        <>

            <h2 className="chats-header">{type}</h2>
            {type === 'conversations' && <Modal list={list} onListClick={onListClick}  />}  

            {items.length > 0 ? (
                items.map((item,index) => (
                <div className={`chat-item ${isItemSelected(item) ? 'active' : ''}`} key={index}>
                    <button
                        className="chat-button"
                        onClick={() =>  handleClick = (item) }
                    >
                        {item.name}
                    {type === 'users' && <div className={`online-status ${item.online ? 'online' : 'offline'}`}>
                        {item.online ? <img src={icononline} alt={item.name} />  : <img src={iconoffine} alt={item.name} />}
                    </div>}
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