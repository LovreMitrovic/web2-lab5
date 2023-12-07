const fs = require('fs');

const get = async (req,res) => {
    if (!/^[0-9]+$/.test(req.params.post_id)) {
        res.sendStatus(400);
        return;
    }
    const post_id = parseInt(req.params.post_id);
    try{
        const posts = await req.app.db.any('SELECT * FROM posts NATURAL JOIN users WHERE post_id = $1',[post_id]);
        if(posts.length === 0){
            res.sendStatus(404);
            return;
        }
        const post = posts[0];
        res.json(post);
    } catch(error){
        console.log(error)
        res.sendStatus(500);
    }
}

const del = async (req,res) => {
    if (!/^[0-9]+$/.test(req.params.post_id)) {
        res.sendStatus(400);
        return;
    }
    const post_id = parseInt(req.params.post_id);
    try{
        const posts = await req.app.db.any('SELECT * FROM posts WHERE post_id = $1',[post_id]);

        if(posts.length === 0){
            res.sendStatus(404);
            return;
        }
        fs.unlinkSync('./public' + posts[0].photo_url);
        /* authorisation
        if(post.user_id !== req.oidc.user.sub){
            res.sendStatus(403);
            return;
        }
         */
        await req.app.db.none('DELETE FROM posts WHERE post_id = $1',[post_id]);
        res.sendStatus(200);
    } catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports = { get,del }