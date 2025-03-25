require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);

// Konfigurasi CORS
// const corsOptions = {
//     origin: 'http://localhost:2222', // Ganti dengan domain yang diizinkan di production
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// };
app.use(cors());

// Root route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Import user routes
const userRouter = require('./user/userRouter');

// Use user routes
app.use('/api', userRouter);

// Start the server
server.listen(process.env.PORT || 2222, () => {
    console.log(`Server berjalan di http://localhost:${process.env.PORT || 2222}`);
});