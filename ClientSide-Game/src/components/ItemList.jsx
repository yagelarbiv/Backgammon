import React, { useState, useEffect } from "react";
import iconoffline from "../assets/icon-offline.png";
import icononline from "../assets/icon-online.png";
import Modal from "./Modal";
import useConversetionStore from "../stores/conversetionStore";


function ItemList({ type, items, isItemSelected, handleClick, onListClick, list }) {

    const deleteConversation = useConversetionStore((state) => state.deleteConversation);

    const handleDelete = (itemToDelete, event ) => {
        event.stopPropagation();
        deleteConversation(itemToDelete.id);
    };

    return (
        <>
            <h2 className="chats-header">{type}</h2>
            {type === 'conversations' && <Modal list={list} onListClick={onListClick} />}  

            {items.length > 0 ? (
                items.map((item, index) => (
                    <div className={`chat-item ${isItemSelected(item) ? 'active' : ''}`} key={item.id || index}>
                        <button className="chat-button" onClick={() => handleClick(item)}>
                            {type === 'conversations' && item.users && item.users.length > 1 && (
                                <>
                                    <span>{item.users[1].name}</span>
                                    <button className="btn btn-danger" onClick={(e) => { handleDelete(item, e); }}>-</button>
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

export default ItemList;
