const {Router} = require('express');
const { userRegistrationController, adminGetAllUsersController, loginUser, updateUserProfileController } = require('../Controllers/authenticationController');
const { verifyToken } = require('../middleware/verifyToken');
const { 
    getAllPostsController, createPostCategoryController, getAllPostCategories, 
    createPostController, 
    getPostDetailsController,
    updatePostController
} = require('../Controllers/postsController');

const router = Router();

// Authentication
router.post('/register', userRegistrationController);
router.post('/login', loginUser);
router.put('/auth/update/profile/:id', verifyToken, updateUserProfileController);
router.get('/admin/users/all', adminGetAllUsersController)

// post category
router.get('/post/categories', getAllPostCategories);
router.post('/post/category/create', verifyToken, createPostCategoryController);

// posts
router.post('/posts/create', verifyToken, createPostController)
router.put('/posts/update/:id', verifyToken, updatePostController)
router.get('/posts', getAllPostsController)
router.get('/posts/:id', getPostDetailsController)



module.exports = router;