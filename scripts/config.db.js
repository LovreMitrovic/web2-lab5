require('dotenv').config();
const pgp = require('pg-promise')();
const db = pgp(process.env.DB_URL);

const createTablesSQL = `
    DROP TABLE IF EXISTS users, posts, comments;

    CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL
    );

    CREATE TABLE posts (
        post_id SERIAL PRIMARY KEY,
        photo_url VARCHAR(255) NOT NULL,
        user_id INT REFERENCES users(user_id)
    );

`;

async function createTables() {
    try {
        await db.none(createTablesSQL);
        console.log('Tables created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        pgp.end();
    }
}

// Call the function to create tables
createTables().then(() => {
    console.log('Exiting...');
});
