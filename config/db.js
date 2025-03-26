// db.js
require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectTimeout: 100000, // Timeout koneksi 60 detik
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
    console.log(`Port: ${process.env.DB_PORT || 3306}`);
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

// Test database connection on startup
checkConnection()
    .then(connected => {
        if (!connected) {
            console.error("Failed to connect to database. Check your .env configuration.");
        }
    });

// Export the pool
module.exports = pool;