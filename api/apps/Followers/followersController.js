const mssql = require('mssql');
const {v4} = require('uuid');
const sqlConfig = require('../../Config/Config');

const getUserFollowersController = async (req, res) => {
    try {
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // checking if user exists
        const user = await pool.request()
            .input('id', mssql.VarChar(50), id)
            .execute('get_user_by_id_proc');

        if(user.recordset.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // getting the user followers
        const user_followers = await pool.request()
            .input('user_id', mssql.VarChar(50), id)
            .execute('get_user_followers_proc');

        return res.status(200).json({
            user_followers: user_followers.recordset
        });
        
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const getUserFollowingController = async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await mssql.connect(sqlConfig);

        // getting user following
        const user_following = await pool.request()
            .input('user_id', mssql.VarChar(50), id)
            .execute('get_user_following_proc');

        return res.status(200).json({
            user_following: user_following.recordset
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const followUnfollowUserController = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const {user_id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // check if user exists
        const user = await pool.request()
            .input('id', mssql.VarChar(50), user_id)
            .execute('get_user_by_id_proc');

        if(user.recordset.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // check if user is already followed
        const user_followed = await pool.request()
            .input('user_id', mssql.VarChar(50), user_id)
            .input('follower_id', mssql.VarChar(50), authenticated_user.id)
            .execute('check_is_followed_proc');

        if(user_followed.recordset.length > 0) {
            // unfollow user
            await pool.request()
                .input('user_id', mssql.VarChar(50), user_id)
                .input('follower_id', mssql.VarChar(50), authenticated_user.id)
                .execute('unfollow_user_proc');

            return res.status(200).json({
                message: 'Unfollowed user'
            });
        }

        // follow user
        await pool.request()
            .input('id', mssql.VarChar(50), v4())
            .input('user_id', mssql.VarChar(50), user_id)
            .input('follower_id', mssql.VarChar(50), authenticated_user.id)
            .execute('follow_user_proc');

        return res.status(200).json({
            message: 'Successfully followed user'
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// procedure to get users that I hace not followed
const getUsersNotFollowingController = async (req, res) => {
    try {
        const authenticated_user = req.user;

        const pool = await mssql.connect(sqlConfig);

        // getting users that I have not followed
        const users_not_following = await pool.request()
            .input('user_id', mssql.VarChar(50), authenticated_user.id)
            .execute('get_users_not_following_proc');

        return res.status(200).json({
            users_not_following: users_not_following.recordset
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const suggestFollowers = async (req, res) => {
    try {
        const authenticated_user = req.user;

        const pool = await mssql.connect(sqlConfig);

        // getting users that I have not followed
        const users_not_following = await pool.request()
            .input('user_id', mssql.VarChar(50), authenticated_user.id)
            .execute('get_users_not_following_proc');

        // get 3 random users
        const random_users = users_not_following.recordset.sort(() => Math.random() - Math.random()).slice(0, 3);
        
        return res.status(200).json({
            random_users: random_users
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const checkIfUserFollowed = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // check if user is already followed
        const user_followed = await pool.request()
            .input('user_id', mssql.VarChar(50), id)
            .input('follower_id', mssql.VarChar(50), authenticated_user.id)
            .execute('check_is_followed_proc');

        if(user_followed.recordset.length > 0) {
            return res.status(200).json({
                message: 'User followed',
                followed: true
            });
        } else {
            return res.status(200).json({
                message: 'User not followed',
                followed: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    getUserFollowersController,
    getUserFollowingController,
    followUnfollowUserController,
    getUsersNotFollowingController,
    suggestFollowers,
    checkIfUserFollowed
}