const {Router} = require('express');
const { userRegistrationController, adminGetAllUsersController, loginUser, updateUserProfileController } = require('../Controllers/authenticationController');
const { verifyToken } = require('../middleware/verifyToken');

const router = Router();

// Authentication
router.post('/register', userRegistrationController);
router.post('/login', loginUser);
router.put('/auth/update/profile/:id', verifyToken, updateUserProfileController);
router.get('/admin/users/all', adminGetAllUsersController)


module.exports = router;