require('dotenv').config();
const express = require('express');
const https = require("https");
const fs = require("fs");
const pgp = require('pg-promise')();
const apiRouter = require('./router/router');
const {join} = require("path");
const app = express();

app.use('/api', apiRouter);
app.use('/', express.static('public'));
app.db = pgp(process.env.DB_URL);

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(port, () => {
    console.log(`Server is running locally on http://localhost:${port}/ and from outside on ${externalUrl}`);
});

/*
if(externalUrl){
    const hostname = '0.0.0.0';
    app.listen(port, hostname, () => {
        console.log(`Server is running locally on http://${hostname}:${port}/ and from outside on ${externalUrl}`);
    });
} else {
    https.createServer({
        key: fs.readFileSync('./ssl/key.pem'),
        cert: fs.readFileSync('./ssl/cert.pem'),
    },app).listen(port, () => {
        console.log(`Server is running on https://localhost:${port}/`);
    });
}
*/