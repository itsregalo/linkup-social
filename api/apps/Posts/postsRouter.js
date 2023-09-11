const {Router} = require('express');
const { verifyToken } = require('../../middleware/verifyToken');
const { createPostController, updatePostController, getAllPostsController, getPostDetailsController, deletePostController, likeUnlikePostController, getUserPostsController, getActivePostsController, deletePostControllerHard } = require('./postsController');
const postsRouter = Router();

postsRouter.post('/create', verifyToken, createPostController)
postsRouter.put('/update/:id', verifyToken, updatePostController)
postsRouter.get('/', getAllPostsController)
postsRouter.get('/current/all', getActivePostsController)
postsRouter.get('/:id', getPostDetailsController)
postsRouter.put('/delete/s/:id', verifyToken, deletePostController)
postsRouter.delete('/delete/h/:id', verifyToken, deletePostControllerHard)
postsRouter.get('/user/:id', getUserPostsController)

postsRouter.post('/:id/like', verifyToken, likeUnlikePostController)


module.exports = postsRouter;