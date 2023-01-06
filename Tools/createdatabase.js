const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function create() {
    var connection = await mysql.createConnection({
        host    : process.env.DB_HOST,
        user    : process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
      
    await connection.connect();
    try {
        await connection.query(`CREATE DATABASE ${process.env.DB_NAME};`);
    } catch(e) {
        // Error will be thrown when database is existing
    }
    await connection.end();

    async function createTable(connection, query) {
        try {
            await connection.query(query);
        } catch (e) {
            console.error('Error when creating table:', e);
        }
    }

    async function createIndex(connection, query) {
        try {
            await connection.query(query);
        } catch (e) {
            console.error('Index is created already', query);
        }
    }

    connection = await mysql.createConnection({
        host    : process.env.DB_HOST,
        user    : process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
                
    await connection.connect();
    await createTable(connection, `
        CREATE TABLE IF NOT EXISTS teams (
            id INT UNSIGNED AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            logo VARCHAR(255) NOT NULL,
            PRIMARY KEY (id)
        );
    `);

    await createTable(connection, `
        CREATE TABLE IF NOT EXISTS tournaments (
            id INT UNSIGNED AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            logo VARCHAR(255) NOT NULL,
            PRIMARY KEY (id)
        );
    `);

    await createTable(connection, `
        CREATE TABLE IF NOT EXISTS matches (
            id INT UNSIGNED AUTO_INCREMENT,
            tournament_id INT UNSIGNED NOT NULL,
            home_team_id INT UNSIGNED NOT NULL,
            away_team_id INT UNSIGNED NOT NULL,
            home_team_score INT UNSIGNED,
            away_team_score INT UNSIGNED,
            start_at DATETIME,
            state INT,
            PRIMARY KEY (id),
            FOREIGN KEY (home_team_id) REFERENCES teams(id),
            FOREIGN KEY (away_team_id) REFERENCES teams(id),
            FOREIGN KEY (tournament_id) REFERENCES tournaments(id) 
        );
    `);

    await connection.end();
}

create();