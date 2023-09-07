const mssql = require('mssql');
const {v4} = require('uuid');
const sqlConfig = require('../Config/Config');

const getUserFollowersProcedure = async (req, res) => {
    try {

        const authenticated_user = req.user;

        const pool = await mssql.connect(sqlConfig);

        const user_followers = await pool.request()
            .input('user_id', mssql.VarChar(50), authenticated_user.id)
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

const getUserFollowingProcedure = async (req, res) => {
    try {
        const authenticated_user = req.user;

        const pool = await mssql.connect(sqlConfig);

        // getting user following
        const user_following = await pool.request()
            .input('user_id', mssql.VarChar(50), authenticated_user.id)
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

const followUnfollowUserProcedure = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const {user_id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // check if user exists
        const user = await pool.request()
            .input('user_id', mssql.VarChar(50), user_id)
            .execute('get_user_by_id_proc');
    } catch (error) {
        
    }
}

module.exports = {
    getUserFollowersProcedure,
    getUserFollowingProcedure
}