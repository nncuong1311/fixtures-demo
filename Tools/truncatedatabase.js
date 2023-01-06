const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function truncate() {
    const connection = await mysql.createConnection({
        host    : process.env.DB_HOST,
        user    : process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    
    await connection.connect();
    await connection.query(`
        DROP DATABASE ${process.env.DB_NAME};
    `);
    await connection.query(`
        CREATE DATABASE ${process.env.DB_NAME};
    `);
    await connection.end();
}

try {
    truncate();
} catch (e) {
    console.error('Error when dropping database:', process.env.DB_NAME, e);
}