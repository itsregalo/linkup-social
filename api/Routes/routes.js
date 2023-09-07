const {Router} = require('express');
const { userRegistrationController, adminGetAllUsersController, loginUser, updateUserProfileController } = require('../Controllers/authenticationController');
const { verifyToken } = require('../middleware/verifyToken');
const { 
    getAllPostsController, 
    createPostController, 
    getPostDetailsController,
    updatePostController,
    deletePostController,
    likeUnlikePostController
} = require('../Controllers/postsController');

const { getAllPostCategories, createPostCategoryController, updateCategoryController, deleteCategoryController } = require('../Controllers/categoriesController');

const router = Router();

// Authentication
router.post('/register', userRegistrationController);
router.post('/login', loginUser);
router.put('/auth/update/profile/:id', verifyToken, updateUserProfileController);
router.get('/admin/users/all', adminGetAllUsersController)

// post category
router.get('/post/categories', getAllPostCategories);
router.post('/post/category/create', verifyToken, createPostCategoryController);
router.put('/post/category/update/:id', verifyToken, updateCategoryController);
router.delete('/post/category/delete/:id', verifyToken, deleteCategoryController);

// posts
router.post('/posts/create', verifyToken, createPostController)
router.put('/posts/update/:id', verifyToken, updatePostController)
router.get('/posts', getAllPostsController)
router.get('/posts/:id', getPostDetailsController)
router.delete('/posts/:id', verifyToken, deletePostController)

// posts likes
router.post('/posts/:id/like', verifyToken, likeUnlikePostController)



module.exports = router;