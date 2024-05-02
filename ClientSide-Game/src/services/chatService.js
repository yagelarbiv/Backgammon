export const fetchMessages = async (receiverName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages?receiverName=${encodeURIComponent(receiverName)}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return await response.json();
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error; // Rethrowing the error is often a good pattern
    }
};

export const unreadMessages = async (receiverName) => {
  try {
    const response = await fetch(`http://localhost:5000/api/messages?receiverName=${encodeURIComponent(receiverName)}&readStatus=false`);
    if (!response.ok) throw new Error('Failed to fetch messages');
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error; // Rethrowing the error is often a good pattern
  }
}