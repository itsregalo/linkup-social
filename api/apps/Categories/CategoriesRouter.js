const {Router} = require('express');
const { getAllPostCategories, createPostCategoryController, updateCategoryController, deleteCategoryController, getPostByCategory } = require('./categoriesController');
const { verifyToken } = require('../../middleware/verifyToken');
const categoryRouter = Router();

categoryRouter.get('/post/categories', getAllPostCategories);
categoryRouter.post('/post/category/create', verifyToken, createPostCategoryController);
categoryRouter.put('/post/category/update/:id', verifyToken, updateCategoryController);
categoryRouter.delete('/post/category/delete/:id', verifyToken, deleteCategoryController);
categoryRouter.get('/post/category/:id', getPostByCategory);

module.exports = categoryRouter;