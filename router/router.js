const express = require('express');
const router = express.Router();
const userController = require('../contollers/user.controller');
const postsController = require('../contollers/posts.controller');
const postController = require('../contollers/post.controller');
const util = require("util");
const bodyParser = require("body-parser");

router.get('/users/:user_id', userController.get);

router.get('/posts', postsController.get);
router.post('/posts',bodyParser.raw({type: ["image/jpeg", "image/png"], limit: "5mb"}), postsController.post);

router.get('/posts/:post_id', postController.get);
router.delete('/posts/:post_id', postController.del);

module.exports = router;
