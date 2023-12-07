const get = async (req,res) => {
    const user_id = req.params.user_id;
    try{
        const users = await req.app.db.any('SELECT * FROM users WHERE user_id = $1',[user_id]);
        if(users.length === 0){
            res.sendStatus(404);
            return;
        }
        const user = users[0];
        let posts = await req.app.db.any('SELECT * FROM posts WHERE user_id = $1',[user_id]);
        posts = posts.map((post) => {
            return {...post, post_url: `/api/posts/${post.post_id}`};
        });
        res.json({user_info: user,posts});
    } catch(error){
        res.sendStatus(500);
    }


}

module.exports = { get }