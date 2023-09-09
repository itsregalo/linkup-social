const {Router} = require('express');
const { userRegistrationController, adminGetAllUsersController, loginUser, forgotPasswordController, resetPasswordController } = require('../Controllers/authenticationController');
const { verifyToken } = require('../middleware/verifyToken');
const { 
    getAllPostsController, createPostController, getPostDetailsController,
    updatePostController, deletePostController, likeUnlikePostController,
    addCommentToPostController, updatePostCommentController, getPostComments, 
    getCommentById, deleteCommentController, getCommentRepliesById, createCommentReplyController, updateCommentReplyController, deleteCommentReplyController
} = require('../Controllers/postsController');

const { getAllPostCategories, createPostCategoryController, updateCategoryController, deleteCategoryController } = require('../Controllers/categoriesController');
const { getUserFollowersProcedure, getUserFollowingProcedure, followUnfollowUserProcedure, getUsersNotFollowingProcedure } = require('../Controllers/followersController');
const { updateUserProfileController, getUserProfileController } = require('../Controllers/profileController');

const router = Router();

// Authentication
router.post('/register', userRegistrationController);
router.post('/login', loginUser);
router.post('/auth/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);
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

// posts comments
router.get('/post/comments/:id', getPostComments)
router.get('/post/comment/detail/:id', getCommentById)
router.post('/posts/:id/comment', verifyToken, addCommentToPostController)
router.put('/posts/:id/comment', verifyToken, updatePostCommentController)
router.delete('/posts/:id/comment', verifyToken, deleteCommentController)

// comments replies
router.get('/post/comment/replies/:id', getCommentRepliesById)
router.post('/posts/:id/comment/reply', verifyToken, createCommentReplyController)
router.put('/posts/:id/comment/reply', verifyToken, updateCommentReplyController)
router.delete('/posts/:id/comment/reply', verifyToken, deleteCommentReplyController)

// follow following
router.get('/user/:id/followers', verifyToken, getUserFollowersProcedure)
router.get('/user/:id/following', verifyToken, getUserFollowingProcedure)
router.post('/user/:user_id/follow', verifyToken, followUnfollowUserProcedure)
router.get('/user/profiles/not-following', verifyToken, getUsersNotFollowingProcedure)

// user profile
router.get('/user/profile/:id', verifyToken, getUserProfileController);
router.put('/auth/update/profile/:id', verifyToken, updateUserProfileController);

module.exports = router;