const {Router} = require('express');
const { verifyToken } = require('../../middleware/verifyToken');
const { createPostController, updatePostController, getAllPostsController, getPostDetailsController, deletePostController, likeUnlikePostController } = require('./postsController');
const postsRouter = Router();

postsRouter.post('/create', verifyToken, createPostController)
postsRouter.put('/update/:id', verifyToken, updatePostController)
postsRouter.get('/', getAllPostsController)
postsRouter.get('/:id', getPostDetailsController)
postsRouter.delete('/:id', verifyToken, deletePostController)

postsRouter.post('/:id/like', verifyToken, likeUnlikePostController)

module.exports = postsRouter;