const mssql = require('mssql');
const {v4} = require('uuid');
const sqlConfig = require('../../Config/Config');
const { cloudinary } = require('../../Utils/cloudinaryConfig');
const { getTaggedUsers, addTaggedUsers } = require('./postUtils');


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
        let {picture, content, caregory_id} = req.body;
        const post_id = v4();

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
                        error: error.message    
                    });
                }
            });

            picture = uploadedPicture.secure_url;
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

// Adding Comment To Post
const addCommentToPostController = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const {id} = req.params;

        let {comment} = req.body;

        // comment is required
        if (!comment) {
            return res.status(400).json({
                message: 'Comment is required'
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

        // adding the comment
        const addedComment = await pool.request()
            .input('id', mssql.VarChar, v4())
            .input('content', mssql.VarChar, comment)
            .input('user_id', mssql.VarChar, authenticated_user.id)
            .input('post_id', mssql.VarChar, id)
            .execute('add_post_comment_proc');

        return res.status(200).json({
            message: 'Comment added successfully',
        });
    } catch (error) {
       return res.status(500).json({
           error: error.message
       }); 
    }
}

// Update Post Comment Controller
const updatePostCommentController = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const {id} = req.params;

        let {comment} = req.body;

        // comment is required
        if (!comment) {
            return res.status(400).json({
                message: 'Comment is required'
            });
        }

        const pool = await mssql.connect(sqlConfig);

        // checking if the comment exist
        const comment_obj = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_comment_by_id_proc');

        if (comment_obj.recordset.length === 0) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        // assertaining that the user is the owner of the comment
        if (comment_obj.recordset[0].user_id !== authenticated_user.id) {
            return res.status(401).json({
                message: 'You cannot update this comment!'
            });
        }

        // updating the comment
        const updatedComment = await pool.request()
            .input('id', mssql.VarChar, id)
            .input('content', mssql.VarChar, comment)
            .execute('update_post_comment_proc');

        return res.status(200).json({
            message: 'Comment updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Getting Comment By Id
const getCommentById = async (req, res) => {
    try {
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // checking if the comment exist
        const comment = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_comment_by_id_proc');

        if (comment.recordset.length === 0) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        // comment likes
        const likes = await pool.request()
            .input('comment_id', mssql.VarChar, id)
            .execute('get_comment_likes_proc');

        // comment replies
        const replies = await pool.request()
            .input('comment_id', mssql.VarChar, id)
            .execute('get_comment_replies_proc');

        return res.status(200).json({
            comment: comment.recordset[0],
            likes: likes.recordset,
            replies: replies.recordset
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Performing a soft delete on a comment
const deleteCommentController = async(req, res) => {
    try {
        const authenticated_user = req.user;
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // checking if the comment exist
        const comment = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_comment_by_id_proc');

        if (comment.recordset.length === 0) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        // checking ownership of the comment
        if (comment.recordset[0].user_id !== authenticated_user.id) {
            return res.status(401).json({
                message: 'You cannot delete this comment!'
            });
        }

        // deleting the comment
        const deletedComment = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('soft_delete_comment_proc');

        return res.status(200).json({
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Like unlike comment controller
const likeUnlikeCommentController = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // checking if the comment exist
        const comment = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_comment_by_id_proc');

        if (comment.recordset.length === 0) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        // checking if the user has liked the comment
        const like = await pool.request()
            .input('comment_id', mssql.VarChar, id)
            .input('user_id', mssql.VarChar, authenticated_user.id)
            .execute('if_user_liked_comment_proc');

        if (like.recordset.length > 0) {
            // unlike the comment
            const unlike = await pool.request()
                .input('comment_id', mssql.VarChar, id)
                .input('user_id', mssql.VarChar, authenticated_user.id)
                .execute('unlike_comment_proc');

            return res.status(200).json({
                message: 'Comment unliked successfully',
            });
        }

        // like the comment
        const likeComment = await pool.request()
            .input('id', mssql.VarChar, v4())
            .input('comment_id', mssql.VarChar, id)
            .input('user_id', mssql.VarChar, authenticated_user.id)
            .execute('like_comment_proc');

        return res.status(200).json({
            message: 'Comment liked successfully',
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}


// Comment Replies Controller
const getCommentRepliesById = async (req, res) => {
    try {
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // checking if the comment exist
        const comment = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_comment_by_id_proc');

        if (comment.recordset.length === 0) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        // comment replies
        const replies = await pool.request()
            .input('comment_id', mssql.VarChar, id)
            .execute('get_comment_replies_proc');

        return res.status(200).json({
            replies: replies.recordset
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Create Comment Reply Controller
const createCommentReplyController = async (req, res) => {
    try {

        const authenticated_user = req.user;
        const {id} = req.params;

        let {comment} = req.body;

        // validating the comment
        if (!comment) {
            return res.status(400).json({
                message: 'Comment is required'
            });
        }

        const pool = await mssql.connect(sqlConfig);

        // checking if the comment exist
        const comment_obj = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_comment_by_id_proc');

        if (comment_obj.recordset.length === 0) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        // adding the comment reply
        const addedReply = await pool.request()
            .input('id', mssql.VarChar, v4())
            .input('content', mssql.VarChar, comment)
            .input('user_id', mssql.VarChar, authenticated_user.id)
            .input('comment_id', mssql.VarChar, id)
            .execute('add_comment_reply_proc');

        return res.status(200).json({
            message: 'Comment reply added successfully',
        });        
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// updating comment reply controller
const updateCommentReplyController = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const {id} = req.params;

        let {comment} = req.body;

        // validating the comment
        if (!comment) {
            return res.status(400).json({
                message: 'Comment is required'
            });
        }

        const pool = await mssql.connect(sqlConfig);

        // checking if the comment exist
        const comment_obj = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_comment_by_id_proc');

        if (comment_obj.recordset.length === 0) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        // checking if logged in user is the owner
        if (comment_obj.recordset[0].user_id !== authenticated_user.id) {
            return res.status(401).json({
                message: 'Permission denied!'
            });
        }

        // updating the comment
        const updatedComment = await pool.request()
            .input('id', mssql.VarChar, id)
            .input('content', mssql.VarChar, comment)
            .execute('update_comment_reply_proc');

        return res.status(200).json({
            message: 'Comment reply updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// delete comment reply controller
const deleteCommentReplyController = async (req, res) => {
    try {
        
        const authenticated_user = req.user;
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // checking if the comment exist
        const comment_obj = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_reply_by_id_proc');

        if (comment_obj.recordset.length === 0) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        // checking if logged in user is the owner
        if (comment_obj.recordset[0].user_id !== authenticated_user.id) {
            return res.status(401).json({
                message: 'Permission denied!'
            });
        }

        // deleting the comment
        const deletedComment = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('soft_delete_reply_proc');

        return res.status(200).json({
            message: 'Comment reply deleted successfully',
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
    getActivePostsController,
    getPostComments,
    getPostDetailsController,
    updatePostController,
    deletePostController,
    deletePostControllerHard,
    getUserPostsController,

    likeUnlikePostController,

    addCommentToPostController,
    updatePostCommentController,
    getCommentById,
    deleteCommentController,

    getCommentRepliesById,
    createCommentReplyController,
    updateCommentReplyController,
    deleteCommentReplyController,

    likeUnlikeCommentController
}