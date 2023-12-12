require('dotenv').config();
const pgp = require('pg-promise')();
const db = pgp(process.env.DB_URL);
const fs = require('fs');
const path = require('path');

const createTablesSQL = `
    DROP TABLE IF EXISTS posts, subscriptions;

    CREATE TABLE posts (
        post_id SERIAL PRIMARY KEY,
        photo_url VARCHAR(255) NOT NULL,
        posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE subscriptions (
        sub_id SERIAL PRIMARY KEY,
        sub_json TEXT NOT NULL
    );

`;

function createTables() {
    db.none(createTablesSQL)
        .then((r) => console.log('Tables created successfully.'))
        .catch((e) => console.error('Error creating tables:', e))
        .finally(()=>{
            pgp.end();
        })
}

function deleteFiles(){
    let counter = 0;
    const directoryPath = "./public/uploads/"
    fs.readdirSync(directoryPath).forEach(file => {
        const filePath = path.join(directoryPath, file);
        if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            counter ++;
        }
    });
    console.log(`${counter} files deleted`);
}

// Call the function to create tables
createTables()
deleteFiles();
