const mssql = require('mssql');
const {v4} = require('uuid');
const sqlConfig = require('../../Config/Config');

const checkIfUserLiked = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const {id} = req.params

        const pool = await mssql.connect(sqlConfig);
        
        const result = await pool.request()
            .input('user_id', mssql.VarChar, authenticated_user.id)
            .input('post_id', mssql.VarChar, id)
            .execute('if_user_liked_post_proc')

        if (result.recordset.length > 0) {
            res.status(200).json({
                message: "User liked post",
                user_liked: true
            })
        } else {
            res.status(200).json({
                message: "User has not liked post",
                user_liked: false
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        
    }
}

module.exports = {
    checkIfUserLiked
}