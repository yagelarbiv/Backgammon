export const updateConversation = (operation, data, setConversations) => {
    switch(operation) {
        case 'add':
            // Add new conversation
            setConversations(prevConversations => [...prevConversations, data]);
            break;
        case 'delete':
            // Delete a conversation
            setConversations(prevConversations => 
                prevConversations.filter(conversation => conversation._id !== data.conversationId));
            break;
        default:
            // Handle unknown operation
            console.error("Unknown operation:", operation);
    }
}