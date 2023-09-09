const {Router} = require('express');
const { verifyToken } = require('../../middleware/verifyToken');
const { getUserFollowersProcedure, getUserFollowingProcedure, followUnfollowUserProcedure, getUsersNotFollowingProcedure } = require('./followersController');
const followersRouter = Router();

followersRouter.get('/user/:id/followers', verifyToken, getUserFollowersProcedure)
followersRouter.get('/user/:id/following', verifyToken, getUserFollowingProcedure)
followersRouter.post('/user/:user_id/follow', verifyToken, followUnfollowUserProcedure)
followersRouter.get('/user/profiles/not-following', verifyToken, getUsersNotFollowingProcedure)

module.exports = followersRouter;