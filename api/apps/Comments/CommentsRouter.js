const {Router} = require('express');
const { getPostComments, getCommentById, addCommentToPostController, updatePostCommentController, deleteCommentController, getCommentRepliesById, createCommentReplyController, updateCommentReplyController, deleteCommentReplyController } = require('../Posts/postsController');
const { verifyToken } = require('../../middleware/verifyToken');
const commentRouter = Router();

commentRouter.get('/post/comments/:id', getPostComments)
commentRouter.get('/post/comment/detail/:id', getCommentById)
commentRouter.post('/posts/:id/comment', verifyToken, addCommentToPostController)
commentRouter.put('/posts/:id/comment', verifyToken, updatePostCommentController)
commentRouter.delete('/posts/:id/comment', verifyToken, deleteCommentController)

commentRouter.get('/post/comment/replies/:id', getCommentRepliesById)
commentRouter.post('/posts/:id/comment/reply', verifyToken, createCommentReplyController)
commentRouter.put('/posts/:id/comment/reply', verifyToken, updateCommentReplyController)
commentRouter.delete('/posts/:id/comment/reply', verifyToken, deleteCommentReplyController)

module.exports = commentRouter;