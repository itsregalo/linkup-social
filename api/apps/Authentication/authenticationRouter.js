const {Router} = require('express');
const { userRegistrationController, loginUser, forgotPasswordController, resetPasswordController, adminGetAllUsersController, deleteUserControllerHard } = require('./authenticationController');
const { verifyToken } = require('../../middleware/verifyToken');
const authenticationRouter = Router();

authenticationRouter.post('/register', userRegistrationController);
authenticationRouter.post('/login', loginUser);
authenticationRouter.post('/forgot-password', forgotPasswordController);
authenticationRouter.post('/reset-password', resetPasswordController);
authenticationRouter.get('/users/all', adminGetAllUsersController);
authenticationRouter.delete('/user/delete/:id', verifyToken, deleteUserControllerHard);

module.exports = authenticationRouter;