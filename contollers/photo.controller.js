const get = async (req,res) => {
    if (!/^[0-9]+$/.test(req.params.post_id)) {
        res.sendStatus(400);
        return;
    }
    const post_id = parseInt(req.params.post_id);
    try{
        const posts = await req.app.db.many('SELECT image FROM posts WHERE post_id = $1',[post_id]);
        if(posts.length === 0){
            res.sendStatus(404);
            return;
        }
        const image = posts[0].image;
        res.setHeader("Content-Disposition", "inline")
            .setHeader("Content-Type","image/png")
            .send(image)
    } catch(error){
        console.log(error)
        res.sendStatus(500);
    }
}
module.exports = { get }