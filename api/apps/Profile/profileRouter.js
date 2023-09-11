const {Router} = require('express');
const { verifyToken } = require('../../middleware/verifyToken');
const { getUserProfileController, updateUserProfileController, updateProfilePicController, updateBackgroundPictureController } = require('./profileController');
const profileRouter = Router();


profileRouter.get('/profile/:id', verifyToken, getUserProfileController);
profileRouter.put('/auth/update/profile/:id', verifyToken, updateUserProfileController);
profileRouter.put('/update/profile/picture/:id', verifyToken, updateProfilePicController);
profileRouter.put('/update/profile/cover/:id', verifyToken, updateBackgroundPictureController);

module.exports = profileRouter;