const mssql = require('mssql');
const {v4} = require('uuid');
const sqlConfig = require('../../Config/Config');


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

        console.log(addedComment);

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