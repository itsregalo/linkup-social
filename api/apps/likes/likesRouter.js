const {Router} = require('express');
const { verifyToken } = require('../../middleware/verifyToken');
const { checkIfUserLiked } = require('./likesController');
const likesRouter = Router();

likesRouter.get('/post/:id', verifyToken, checkIfUserLiked);

module.exports = likesRouter;