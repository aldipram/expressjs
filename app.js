require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const http = require('http');
const app = express();
const server = http.createServer(app);

// Konfigurasi CORS
const corsOptions = {
    origin: 'https://expressjs-wheat-nine.vercel.app/', // Ganti dengan domain yang diizinkan di production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectTimeout: 60000, // Timeout koneksi 60 detik
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Using CommonJS exports instead of ES modules
const checkConnection = async () => {
    console.log('Attempting to connect to database with:');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    return pool.getConnection()
        .then((connection) => {
            connection.release();
            console.log('Database connection successful');
            return true;
        })
        .catch((err) => {
            console.error("Database connection failed:", err);
            // Tampilkan informasi lebih detail tentang error
            if (err.code === 'ETIMEDOUT') {
                console.error("Koneksi timeout. Pastikan server database aktif dan dapat diakses dari jaringan Anda.");
                console.error("Coba periksa: 1) Firewall, 2) Remote MySQL access di cPanel, 3) Alamat host yang benar");
            } else if (err.code === 'ECONNREFUSED') {
                console.error("Koneksi ditolak. Server database mungkin tidak berjalan atau port salah.");
            } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                console.error("Akses ditolak. Username atau password mungkin salah.");
            }
            return false;
        });
};

// Export the function
module.exports = { checkConnection, pool };

// Test database connection on startup
checkConnection()
    .then(connected => {
        if (!connected) {
            console.error("Failed to connect to database. Check your .env configuration.");
        }
    });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Function to get all users from database
const getUsers = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM db_user');
        return rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


// Route to get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.get('/api/pencapaian', async (req, res) => {
    try {
        // Get all achievement data
        const [rows] = await pool.query('SELECT u.username as username, m.kategori as kategori, m.materi as materi FROM db_pencapaian p LEFT JOIN db_materi m ON p.materi_id = m.id LEFT JOIN db_user u ON p.user_id = u.id');
        
        // Transform data to group by username and category
        const groupedData = {};
        
        // Process each row
        rows.forEach(row => {
            const { username, kategori, materi } = row;
            
            // Initialize user if not exists
            if (!groupedData[username]) {
                groupedData[username] = {
                    username,
                    kategori: {}
                };
            }
            
            // Initialize category if not exists
            if (!groupedData[username].kategori[kategori]) {
                groupedData[username].kategori[kategori] = [];
            }
            
            // Add material to category if not already included
            if (!groupedData[username].kategori[kategori].includes(materi)) {
                groupedData[username].kategori[kategori].push(materi);
            }
        });
        
        // Convert to array format
        const result = Object.values(groupedData);
        
        res.json(result);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});


server.listen(process.env.PORT || 2222, () => {
    console.log(`Server berjalan di http://localhost:${process.env.PORT || 2222}`);
});