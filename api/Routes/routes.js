const {Router} = require('express');
const { userRegistrationController } = require('../Controllers/authenticationController');

const router = Router();

// Authentication
router.post('/register', userRegistrationController);


module.exports = router;