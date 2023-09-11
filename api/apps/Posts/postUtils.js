const mssql = require('mssql');
const sqlConfig = require('../../Config/Config');

const getTaggedUsers = (text) => {
    const regex = /@([a-z0-9_-]+)/gi;
    const matches = text.match(regex);
    if (matches) {
        return matches.map((match) => match.slice(1));
    }
    return [];
}

const getHashtags = (text) => {
    const regex = /#([a-z0-9_-]+)/gi;
    const matches = text.match(regex);
    if (matches) {
        return matches.map((match) => match.slice(1));
    }
    return [];
}

const addTaggedUsers = async (post_id, tagged_users) => {
    try {
        const pool = await mssql.connect(sqlConfig);

        for (let user_tagged of tagged_users) {
            // check if user exists
            const user = await pool.request()
                .input('username', mssql.VarChar(50), user_tagged)
                .execute('get_user_by_username_proc');

            if (user.recordset.length === 0) {
                continue;
            }

            // check if user is already tagged
            const tagged_user = await pool.request()
                .input('user_id', mssql.VarChar(50), user.recordset[0].id)
                .input('post_id', mssql.VarChar(50), post_id)
                .execute('check_user_tagged_in_post');

            if (tagged_user.recordset.length > 0) {
                continue;
            }

            // add tagged user
            await pool.request()
                .input('user_id', mssql.VarChar(50), user.recordset[0].id)
                .input('post_id', mssql.VarChar(50), post_id)
                .execute('add_tagged_user_proc');
        }
    }
    catch (error) {
       console.log(error);
    }
}

const addHashtags = async (post_id, hashtags) => {
    try {
        const pool = await mssql.connect(sqlConfig);

        for (let hashtag of hashtags) {
            // check if hashtag exists
            const hashtag_result = await pool.request()
                .input('hashtag', mssql.VarChar(50), hashtag)
                .execute('get_hashtag_proc');

            if (hashtag_result.recordset.length === 0) {
                // add hashtag
                await pool.request()
                    .input('hashtag', mssql.VarChar(50), hashtag)
                    .execute('add_hashtag_proc');
            }

            // check if post is already tagged
            const post_hashtag = await pool.request()
                .input('hashtag', mssql.VarChar(50), hashtag)
                .input('post_id', mssql.VarChar(50), post_id)
                .execute('get_post_hashtag_proc');

            if (post_hashtag.recordset.length > 0) {
                continue;
            }

            // add post hashtag
            await pool.request()
                .input('hashtag', mssql.VarChar(50), hashtag)
                .input('post_id', mssql.VarChar(50), post_id)
                .execute('add_post_hashtag_proc');
        }
    }
    catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const removeAllTaggedUsers = async (post_id) => {
    try {
        const pool = await mssql.connect(sqlConfig);

        // remove all tagged users
        await pool.request()
            .input('post_id', mssql.VarChar(50), post_id)
            .execute('remove_all_tagged_users_proc');
    }
    catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    getTaggedUsers,
    getHashtags,
    addTaggedUsers,
    addHashtags,
    removeAllTaggedUsers
}


