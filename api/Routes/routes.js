const {Router} = require('express');
const { userRegistrationController, adminGetAllUsersController, loginUser } = require('../Controllers/authenticationController');

const router = Router();

// Authentication
router.post('/register', userRegistrationController);
router.post('/login', loginUser);
router.get('/admin/users/all', adminGetAllUsersController)


module.exports = router;