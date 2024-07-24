export const PORT = process.env.PORT || 5888;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const API_URL = process.env.API_URL || 'https://localhost:6001';

export const corsOptions = {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true,
};