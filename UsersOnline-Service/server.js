import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import sql from 'mssql';

const app = express();
const PORT = process.env.PORT || 5777;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST"],
    credentials: true
}));


app.use(bodyParser.json());

// SQL Server connection configuration
const config = {
  server: process.env.DB_SERVER || "DESKTOP-KGPO5UJ", 
  database: process.env.DB_NAME || "AuthenticationServer",
//   user: "DESKTOP-KGPO5UJ/David",
  options: {
    trustedConnection: true
  }
};

// Async function to connect to the database
const connectToDatabase = async () => {
  try {
    console.log(config);
    await sql.connect(config);
    console.log("Connected to SQL Server successfully!");
  } catch (err) {
    console.error('Failed to connect to SQL Server:', err);
    process.exit(1); // Exit the process with an error code
  }
};

// Connect to the database
connectToDatabase();

// API route to get online status of users
app.get('/api/users/online-status', async (req, res) => {
  try {
    const result = await sql.query(`SELECT Id, UserName FROM [dbo].[AppUsers]`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});