const mysql = require('mysql2/promise');

// --- Database Configuration ---
const pool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'gweb_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection at startup
pool.getConnection()
    .then(conn => {
        console.log("\n✅ Database connection successfully established!");
        conn.release();
    })
    .catch(err => {
        console.error("\n❌ Database error:", err.message);
    });

module.exports = pool;