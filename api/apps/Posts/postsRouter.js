const {Router} = require('express');
const { verifyToken } = require('../../middleware/verifyToken');
const { createPostController, updatePostController, getAllPostsController, getPostDetailsController, deletePostController, likeUnlikePostController } = require('./postsController');
const postsRouter = Router();

postsRouter.post('/posts/create', verifyToken, createPostController)
postsRouter.put('/posts/update/:id', verifyToken, updatePostController)
postsRouter.get('/posts', getAllPostsController)
postsRouter.get('/posts/:id', getPostDetailsController)
postsRouter.delete('/posts/:id', verifyToken, deletePostController)

postsRouter.post('/posts/:id/like', verifyToken, likeUnlikePostController)

module.exports = postsRouter;