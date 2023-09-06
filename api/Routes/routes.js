const {Router} = require('express');
const { userRegistrationController, adminGetAllUsersController, loginUser, updateUserProfileController } = require('../Controllers/authenticationController');
const { verifyToken } = require('../middleware/verifyToken');
const { getAllPostsController, getPostById, createPostCategoryController } = require('../Controllers/postsController');

const router = Router();

// Authentication
router.post('/register', userRegistrationController);
router.post('/login', loginUser);
router.put('/auth/update/profile/:id', verifyToken, updateUserProfileController);
router.get('/admin/users/all', adminGetAllUsersController)

// post category
router.post('/post/category/create', verifyToken, createPostCategoryController);

// posts
router.get('/posts', getAllPostsController)
router.get('/posts/:id', getPostById),



module.exports = router;