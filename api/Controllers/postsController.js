const mssql = require('mssql');
const {v4} = require('uuid');
const sqlConfig = require('../Config/Config');

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

const getPostById = async (req, res) => {
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

        // getting the likes
        const likes = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_post_likes_proc');


        return res.status(200).json({
            post: post.recordset[0],
            comments: comments.recordset,
            likes: likes.recordset
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const createPostController = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const {picture, content, caregory_id} = req.body;

        // content is required
        if (!content) {
            return res.status(400).json({
                message: 'Content is required'
            });
        }

        const pool = await mssql.connect(sqlConfig);

        // checking if the category exist, if not, assign the default category
        const category = await pool.request()
            .input('id', mssql.VarChar, caregory_id)
            .execute('get_category_by_id_proc');

        if (category.recordset.length === 0) {
            caregory_id = '1';
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


module.exports = {
    createPostController,
    getAllPostsController,
    getPostById,
    createPostCategoryController,
    getCommentsByPostId
}