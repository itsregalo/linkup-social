const {Router} = require('express');
const { verifyToken } = require('../../middleware/verifyToken');
const { getUserProfileController, updateUserProfileController } = require('./profileController');
const profileRouter = Router();


profileRouter.get('/profile/:id', verifyToken, getUserProfileController);
profileRouter.put('/auth/update/profile/:id', verifyToken, updateUserProfileController);

module.exports = profileRouter;