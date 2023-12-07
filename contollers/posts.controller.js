const bodyParser = require("body-parser");
const util = require('util');
const fs = require("fs").promises;
const crypto = require('crypto');

const get = async (req,res) => {
    const skip = parseInt(req.query.skip) ? parseInt(req.query.skip) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    try {
        let posts = await req.app.db.any('SELECT *  FROM posts NATURAL JOIN users ORDER BY post_id DESC OFFSET $1 LIMIT $2',[skip,limit]);
        posts = posts.map((post) => {
            return {...post,
                post_url: `/api/posts/${post.post_id}`,
                user_url: `/api/users/${post.user_id}`};
        });
        res.json(posts);
    } catch(error){
        res.sendStatus(500);
    }
}

const post = async (req,res) => {
    try {
        const imageData = req.body;
        console.log(imageData);
        // check if data less than 5MB
        if(imageData.length > 5 * 1024 * 1024){
            res.status(400).json({error: 'Image must be less than 5MB'});
            return;
        }
        const uuid = crypto.randomUUID();
        const user_id = 1;
        await fs.writeFile(`./public/uploads/${uuid}.jpg`, imageData);
        const {post_id} = await req.app.db.one('INSERT INTO posts (user_id, photo_url) VALUES ($1, $2) RETURNING post_id', [user_id, `/uploads/${uuid}.jpg`]);
        res.setHeader('Location', `/api/posts/${post_id}`).status(201).end();
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

module.exports = { get, post}