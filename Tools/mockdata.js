const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function mock() {
    var connection = await mysql.createConnection({
        host    : process.env.DB_HOST,
        user    : process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    
    async function createTeam(connection, name, logo) {
        try {
            await connection.query(`
                INSERT INTO teams(name, logo) VALUES ('${name}','${logo}');
            `);
        } catch (e) {
            console.error('Error when creating team:', e);
        }
    }

    async function createTournament(connection, name, logo) {
        try {
            await connection.query(`
                INSERT INTO tournaments(name, logo) VALUES ('${name}','${logo}');
            `);
        } catch (e) {
            console.error('Error when creating tournament:', e);
        }
    }

    async function createMatch(connection, tournament_id, home_team_id, away_team_id, home_team_score, away_team_score, start_at, state) {
        try {
            await connection.query(`
                INSERT INTO matches(tournament_id, home_team_id, away_team_id, home_team_score, away_team_score, start_at, state) 
                VALUES ('${tournament_id}', '${home_team_id}', '${away_team_id}', '${home_team_score}', '${away_team_score}', '${start_at}', '${state}');
            `);
        } catch (e) {
            console.error('Error when creating match:', e);
        }
    }

                
    await connection.connect();
    await createTournament(connection, 'EPL', 'epl.png'); // id: 1
    await createTournament(connection, 'Laliga', 'laliga.png'); // id: 2
    await createTeam(connection, 'Arsenal', 'ar.png'); // id: 1
    await createTeam(connection, 'Manchester United', 'mu.png'); // id: 2
    await createTeam(connection, 'Real Madrid', 're.png'); // id: 3
    await createTeam(connection, 'Barcelona', 'ba.png'); // id: 4
    await createMatch(connection, 1, 1, 2, 3, 0, '2022-02-01', 1);
    await createMatch(connection, 1, 2, 1, 1, 2, '2022-02-21', 1);
    await createMatch(connection, 2, 3, 4, 1, 2, '2022-02-01', 1);
    await createMatch(connection, 2, 4, 3, 2, 2, '2022-02-11', 1);

    await connection.end();
}

mock();