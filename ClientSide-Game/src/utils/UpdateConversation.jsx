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
        case 'modify':
            // Modify an existing conversation
            setConversations(prevConversations =>
                prevConversations.map(conversation =>
                    conversation._id === data.conversationId ? { ...conversation, ...data.updates } : conversation
                ));
            break;
        default:
            // Handle unknown operation
            console.error("Unknown operation:", operation);
    }
}