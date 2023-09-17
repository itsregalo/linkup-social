const mssql = require('mssql');
const {v4} = require('uuid');

const checkIfUserLiked = async (req, res) => {
    try {
        const authenticated_user = req.user;
        const post_id = req.params.id;

        const pool = await mssql.connect(config);
        const result = await pool.request()

        .input('user_id', mssql.VarChar, authenticated_user.id)
        .input('post_id', mssql.VarChar, post_id)
        .execute('if_user_liked_post_proc')

        if (result.recordset.length > 0) {
            res.status(200).json({
                message: "User liked post",
                user_liked: true
            })
        }

        res.status(200).json({
            message: "Not Liked",
            user_liked: false
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        
    }
}

module.exports = {
    checkIfUserLiked
}