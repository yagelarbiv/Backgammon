import {express, cors, http, Server, dotenv, PORT, FRONTEND_URL,
   corsOptions, setupSocketAuth, setupSocketHandlers, fetchAllUsers} from './import.js';

dotenv.config();

const app = express();
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

setupSocketAuth(io);
setupSocketHandlers(io);

const startServer = async () => {
  await fetchAllUsers();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();