const {Router} = require('express');
const { userRegistrationController, loginUser, forgotPasswordController, resetPasswordController, adminGetAllUsersController } = require('./authenticationController');
const authenticationRouter = Router();

authenticationRouter.post('//register', userRegistrationController);
authenticationRouter.post('/login', loginUser);
authenticationRouter.post('/forgot-password', forgotPasswordController);
authenticationRouter.post('/reset-password', resetPasswordController);
authenticationRouter.get('/admin/users/all', adminGetAllUsersController)

module.exports = authenticationRouter;