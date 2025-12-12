require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const { startSimulation } = require('./utils/energySimulator');

const app = express();
const server = http.createServer(app);

// Connect Database
connectDB();

// Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Socket.IO Setup
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all for dev, lock down in prod
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

// Start Data Simulation
startSimulation(io);

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('PowerView API Running');
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/energy', require('./routes/energy'));
app.use('/api/user', require('./routes/user'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
