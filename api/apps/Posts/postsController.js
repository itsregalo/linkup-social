const mssql = require('mssql');
const {v4} = require('uuid');
const sqlConfig = require('../../Config/Config');
const { cloudinary } = require('../../Utils/cloudinaryConfig');
const { getTaggedUsers, addTaggedUsers } = require('./postUtils');
const upload = require('../../middleware/multer');

/**
 * Post Controllers
 */

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

const getActivePostsController = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const posts = await pool.request()
            .execute('get_active_posts_proc');
        return res.status(200).json({
            posts: posts.recordset
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Get User Posts
const getUserPostsController = async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await mssql.connect(sqlConfig);

        // checking if the user exists
        const user = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_user_by_id_proc');

        if (user.recordset.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // getting the user posts
        const posts = await pool.request()
            .input('user_id', mssql.VarChar, id)
            .execute('get_user_posts_proc');

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

        // get users tagged in post
        const tagged_users = await pool.request()
            .input('post_id', mssql.VarChar, id)
            .execute('get_post_users_tagged');

        // get post category
        const category_id = post.recordset[0].category_id;

        const category = await pool.request()
            .input('id', mssql.VarChar, category_id)
            .execute('get_category_by_id_proc');

        return res.status(200).json({
            post: post.recordset[0],
            comments: comments.recordset,
            likes: likes.recordset,
            category: category.recordset[0],
            tagged_users: tagged_users.recordset

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
        let {picture, content, category_id} = req.body;
        const post_id = v4();
        

        // content is required
        if (!content) {
            return res.status(400).json({
                message: 'Content is required'
            });
        }

        const pool = await mssql.connect(sqlConfig);

        if(!category_id) {
            const default_category = await pool.request()
                .execute('get_default_category_proc');
            category_id = default_category.recordset[0].id;
        }

        // checking if the category exist, if not
        const category = await pool.request()
            .input('id', mssql.VarChar, category_id)
            .execute('get_category_by_id_proc');

        if (category.recordset.length === 0) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // check for tagged users in the content
        const tagged_users = await getTaggedUsers(content);

        try {
            await addTaggedUsers(post_id, tagged_users);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        // creating the post
        const post = await pool.request()
            .input('id', mssql.VarChar, v4())
            .input('picture', mssql.VarChar, picture)
            .input('content', mssql.VarChar, content)
            .input('user_id', mssql.VarChar, authenticated_user.id)
            .input('category_id', mssql.VarChar, category_id)
            .execute('create_post_proc');

        return res.status(201).json({
            message: 'Post created successfully',
        });

    } catch (error) {
        console.log(error);
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

        let {picture, content, category_id} = req.body;

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
        if (!category_id) {
            const default_category = await pool.request()
                .execute('get_default_category_proc');
            category_id = default_category.recordset[0].id;
        }

        // checking if the category exist
        const category = await pool.request()
            .input('id', mssql.VarChar, category_id)
            .execute('get_category_by_id_proc');

        if (category.recordset.length === 0) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // checking if the user has uploaded a picture
        if (picture) {
            const cloudinaryOptions = {
                use_filename: true,
                unique_filename: false,
                overwrite: true,
                resource_type: "auto"
            };
            // uploading the picture to cloudinary
            const uploadedPicture = await cloudinary.uploader.upload(picture, cloudinaryOptions, (error, result) => {
                if (error) {
                    return res.status(500).json({
                        error: error
                    });
                }
            });

            picture = uploadedPicture.secure_url;
        }

        // updating the post
        const updatedPost = await pool.request()
            .input('id', mssql.VarChar, id)
            .input('picture', mssql.VarChar, picture)
            .input('content', mssql.VarChar, content)
            .input('category_id', mssql.VarChar, category_id)
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

// Delete Post Controller, Soft Delete
const deletePostController = async (req, res) => {
    try {
        const authenticated_user = req.user;
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

        // assertaining that the user is the owner of the post
        if (post.recordset[0].user_id !== authenticated_user.id) {
            return res.status(401).json({
                message: 'You cannot delete this post!'
            });
        }

        // deleting the post
        const deletedPost = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('soft_delete_post_proc');

        return res.status(200).json({
            message: 'Post deleted successfully',
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// delete post controller, hard delete
const deletePostControllerHard = async (req, res) => {
    try {
        const authenticated_user = req.user;
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

        // assertaining that the user is the owner of the post
        if (post.recordset[0].user_id !== authenticated_user.id) {
            return res.status(401).json({
                message: 'You cannot delete this post!'
            });
        }

        // deleting the post
        const deletedPost = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('hard_delete_post_proc');

        return res.status(200).json({
            message: 'Post deleted successfully',
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Like Unlike Post Controller
const likeUnlikePostController = async (req, res) => {
    try {
        const authenticated_user = req.user;
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

        // checking if the user has liked the post
        const like = await pool.request()
            .input('post_id', mssql.VarChar, id)
            .input('user_id', mssql.VarChar, authenticated_user.id)
            .execute('if_user_liked_post_proc');

        if (like.recordset.length > 0) {
            // unlike the post
            const unlike = await pool.request()
                .input('post_id', mssql.VarChar, id)
                .input('user_id', mssql.VarChar, authenticated_user.id)
                .execute('unlike_post_proc');

            return res.status(200).json({
                message: 'Post unliked successfully',
            });
        }

        // like the post
        const likePost = await pool.request()
            .input('id', mssql.VarChar, v4())
            .input('post_id', mssql.VarChar, id)
            .input('user_id', mssql.VarChar, authenticated_user.id)
            .execute('like_post_proc');

        return res.status(200).json({
            message: 'Post liked successfully',
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}


// Getting Comments By Post Id
const getPostComments = async (req, res) => {
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
            
        return res.status(200).json({
            comments: comments.recordset
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}


const getPostsOfFollowedUsers = async (req, res) => {
    try {
        const authenticated_user = req.user;

        const pool = await mssql.connect(sqlConfig);

        // getting posts of followed users
        const posts = await pool.request()
            .input('user_id', mssql.VarChar(50), authenticated_user.id)
            .execute('get_posts_from_users_following_proc');

        return res.status(200).json({
            posts: posts.recordset
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const checkIfUserOwnsPost = async (req, res) => {
    try {
        const authenticated_user = req.user;
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

        if (post.recordset[0].user_id !== authenticated_user.id) {
            return res.status(401).json({
                message: 'You cannot delete this post!',
                owner: false
            });
        } else {
            return res.status(200).json({
                message: 'Owner',
                owner: true
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    createPostController,
    getAllPostsController,
    getActivePostsController,
    getPostComments,
    getPostDetailsController,
    updatePostController,
    deletePostController,
    deletePostControllerHard,
    getUserPostsController,
    getPostsOfFollowedUsers,

    likeUnlikePostController,
    checkIfUserOwnsPost
}