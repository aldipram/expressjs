const pool = require('../config/db');

exports.getUsers = async () => {
    try {

        const query = 'SELECT * FROM db_user';

        const [rows] = await pool.query(query);
        console.log(rows);
        
        return rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

exports.getPencapaian = async () => {
    try {
        // Get all achievement data
        const query = 'SELECT u.username as username, m.kategori as kategori, m.materi as materi FROM db_pencapaian p LEFT JOIN db_materi m ON p.materi_id = m.id LEFT JOIN db_user u ON p.user_id = u.id';

        const [rows] = await pool.query(query);
        
        if (rows.length === 0) {
            return { 
                status: 'failed', 
                code: 404, 
                message: 'Not found' 
            };
        }
        
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
        
        return {
            status: 'success',
            code: 200,
            data: result
        };
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return {
            status: 'failed',
            code: 500,
            message: error.message
        };
    }
};