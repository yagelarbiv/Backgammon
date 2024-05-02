import create from 'zustand';
import { io } from 'socket.io-client';

const useSocketStore = create((set, get) => ({
  socket: null,
  connectSocket: () => {
    const socket = io('http://localhost:3003', {
      withCredentials: true,
      transports: ['websocket'],  // Ensuring to use WebSockets
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    set({ socket });
  },
  disconnectSocket: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },
}));

export default useSocketStore;