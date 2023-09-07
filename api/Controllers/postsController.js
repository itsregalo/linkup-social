const mssql = require('mssql');
const {v4} = require('uuid');
const sqlConfig = require('../Config/Config');

// Get All Posts Controller
const getAllPostsController = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const posts = await pool.request()
            .execute('get_all_posts_proc');
        return res.status(200).json({
            posts: posts.recordset
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}


// Post Details Controller (By Id)
const getPostDetailsController = async (req, res) => {
    try {

        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // checking if the post exist
        const post = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_post_by_id_proc');

        if (post.recordset.length === 0) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        // getting the comments
        const comments = await pool.request()
            .input('post_id', mssql.VarChar, id)
            .execute('get_post_comments_proc');

        // getting the likes
        const likes = await pool.request()
            .input('post_id', mssql.VarChar, id)
            .execute('get_post_likes_proc');

        // get post category
        const category_id = post.recordset[0].category_id;

        const category = await pool.request()
            .input('id', mssql.VarChar, category_id)
            .execute('get_category_by_id_proc');

        return res.status(200).json({
            post: post.recordset[0],
            comments: comments.recordset,
            likes: likes.recordset,
            category: category.recordset[0]
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Create Post Controller
const createPostController = async (req, res) => {
    try {
        const authenticated_user = req.user;
        let {picture, content, caregory_id} = req.body;

        // content is required
        if (!content) {
            return res.status(400).json({
                message: 'Content is required'
            });
        }

        const pool = await mssql.connect(sqlConfig);

        if(!caregory_id) {
            const default_category = await pool.request()
                .execute('get_default_category_proc');
            caregory_id = default_category.recordset[0].id;
        }

        // checking if the category exist, if not
        const category = await pool.request()
            .input('id', mssql.VarChar, caregory_id)
            .execute('get_category_by_id_proc');

        console.log(category.recordset);

        if (category.recordset.length === 0) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // creating the post
        const post = await pool.request()
            .input('id', mssql.VarChar, v4())
            .input('picture', mssql.VarChar, picture)
            .input('content', mssql.VarChar, content)
            .input('user_id', mssql.VarChar, authenticated_user.id)
            .input('category_id', mssql.VarChar, caregory_id)
            .execute('create_post_proc');

        return res.status(200).json({
            message: 'Post created successfully',
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Updating a post controller
const updatePostController = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const {id} = req.params;

        let {picture, content, caregory_id} = req.body;

        // content is required
        if (!content) {
            return res.status(400).json({
                message: 'Content is required'
            });
        }

        const pool = await mssql.connect(sqlConfig);

        // checking if the post exist
        const post = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_post_by_id_proc');

        if (post.recordset.length === 0) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        // assertaining that the user is the owner of the post
        if (post.recordset[0].user_id !== authenticated_user.id) {
            return res.status(401).json({
                message: 'You cannot update this post!'
            });
        }

        // checking if the category exist, if not use the default category
        if (!caregory_id) {
            const default_category = await pool.request()
                .execute('get_default_category_proc');
            caregory_id = default_category.recordset[0].id;
        }

        // checking if the category exist
        const category = await pool.request()
            .input('id', mssql.VarChar, caregory_id)
            .execute('get_category_by_id_proc');

        if (category.recordset.length === 0) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // updating the post
        const updatedPost = await pool.request()
            .input('id', mssql.VarChar, id)
            .input('picture', mssql.VarChar, picture)
            .input('content', mssql.VarChar, content)
            .input('category_id', mssql.VarChar, caregory_id)
            .execute('update_post_proc');

        return res.status(200).json({
            message: 'Post updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Getting Comments By Post Id
const getCommentsByPostId = async (req, res) => {
    try {
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // checking if the post exist
        const post = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_post_by_id_proc');

        if (post.recordset.length === 0) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        // getting the comments
        const comments = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_comments_by_post_id_proc');
            
        return res.status(200).json({
            comments: comments.recordset
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// creating post category
const createPostCategoryController = async (req, res) => {
    try {

        const {name} = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Name is required'
            });
        }

        const pool = await mssql.connect(sqlConfig);

        // checking if the category exist
        const category = await pool.request()
            .input('name', mssql.VarChar, name)
            .execute('get_category_by_name_proc');

        if (category.recordset.length > 0) {
            return res.status(400).json({
                message: 'Category already exist'
            });
        }

        // creating the category
        const newCategory = await pool.request()
            .input('id', mssql.VarChar, v4())
            .input('name', mssql.VarChar, name)
            .execute('create_post_category_proc');

        return res.status(200).json({
            message: 'Category created successfully',
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const getAllPostCategories = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const categories = await pool.request()
            .execute('get_all_post_categories_proc');
        return res.status(200).json({
            categories: categories.recordset
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}


module.exports = {
    createPostController,
    getAllPostsController,
    createPostCategoryController,
    getCommentsByPostId,
    getAllPostCategories,
    getPostDetailsController,
    updatePostController
}