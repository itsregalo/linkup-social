const {Router} = require('express');
const { verifyToken } = require('../../middleware/verifyToken');
const { 
    getUserFollowersController, getUserFollowingController, 
    followUnfollowUserController, getUsersNotFollowingController, 
    suggestFollowers, checkIfUserFollowed } = require('./followersController');
const followersRouter = Router();

followersRouter.get('/user/:id/followers', verifyToken, getUserFollowersController)
followersRouter.get('/user/:id/following', verifyToken, getUserFollowingController)
followersRouter.post('/user/:user_id/follow', verifyToken, followUnfollowUserController)
followersRouter.get('/user/profiles/not-following', verifyToken, getUsersNotFollowingController)
followersRouter.get('/user/profiles/suggested', verifyToken, suggestFollowers)
followersRouter.get('/user/check-follow/:id', verifyToken, checkIfUserFollowed)

module.exports = followersRouter;