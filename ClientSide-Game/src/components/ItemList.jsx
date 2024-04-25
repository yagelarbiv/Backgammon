import React, { useState, useEffect } from "react";
import iconoffline from "../assets/icon-offline.png";
import icononline from "../assets/icon-online.png";
import Modal from "./Modal";

function ItemList({ type, items, isItemSelected, handleClick, onListClick, list }) {
    const [currentItems, setCurrentItems] = useState(items); // Initialize with your items

    // Synchronize state with the items prop whenever it changes
    useEffect(() => {
        setCurrentItems(items);
    }, [items]);

    const handleDelete = (itemToDelete) => {
        // Filter out the item to delete
        const newList = currentItems.filter(item => item.id !== itemToDelete.id);
        setCurrentItems(newList); // Update state with the new list
    };

    return (
        <>
            <h2 className="chats-header">{type}</h2>
            {type === 'conversations' && <Modal list={list} onListClick={onListClick} />}  

            {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                    <div className={`chat-item ${isItemSelected(item) ? 'active' : ''}`} key={item.id || index}>
                        <button className="chat-button" onClick={() => handleClick(item)}>
                            {type === 'conversations' && item.users && item.users.length > 1 && (
                                <>
                                    <span>{item.users[1].name}</span>
                                    <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(item); }}>-</button>
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
