const mssql = require('mssql');
const {v4} = require('uuid');
const sqlConfig = require('../../Config/Config');
const { userUpdateValidateor } = require('../../Validators/AuthenticationValidators');



// update user profile controller
const updateUserProfileController = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const {id} = req.params;

        // checking if the user is authenticated
        if(authenticated_user.id !== id) {
            return res.status(403).json({
                message: "Access denied"
            });
        }
        
        // checking if the user exists
        const pool = await mssql.connect(sqlConfig);
        
        const user = await pool.request()
            .input('id', mssql.VarChar, authenticated_user.id)
            .execute('get_user_by_id_proc');

        if(user.recordset.length === 0) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        const {username, full_name, location, bio, profile_picture, background_picture} = req.body;

        // checking if the fields are empty
        const {error} = userUpdateValidateor.validate(req.body);

        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            })
        }



        // updating the user
        const updated_user = await pool.request()
            .input('id', mssql.VarChar, authenticated_user.id)
            .input('username', mssql.VarChar, username)
            .input('full_name', mssql.VarChar, full_name)
            .input('location', mssql.VarChar, location)
            .input('bio', mssql.VarChar, bio)
            .input('profile_picture', mssql.VarChar, profile_picture)
            .input('background_picture', mssql.VarChar, background_picture)
            .execute('update_user_profile_proc');

        return res.status(200).json({
            message: "User profile updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// controller to get user by id
const getUserProfileController = async (req, res) => {
    try {
        const {id} = req.params;

        // checking if the user exists
        const pool = await mssql.connect(sqlConfig);
        const user = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_user_by_id_proc');

        if(user.recordset.length === 0) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        // getting user followers
        const user_followers = await pool.request()
            .input('user_id', mssql.VarChar(50), id)
            .execute('get_user_followers_proc');

        // getting user following
        const user_following = await pool.request()
            .input('user_id', mssql.VarChar(50), id)
            .execute('get_user_following_proc');

        // getting user posts
        const user_posts = await pool.request()
            .input('user_id', mssql.VarChar(50), id)
            .execute('get_user_posts_proc');

        return res.status(200).json({
            user: user.recordset[0],
            user_followers: user_followers.recordset,
            user_following: user_following.recordset,
            user_posts: user_posts.recordset
        });

        // checking if the user is authenticated
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    updateUserProfileController,
    getUserProfileController
}