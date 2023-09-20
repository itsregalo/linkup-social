const mssql = require('mssql');
const {v4} = require('uuid');
const sqlConfig = require('../../Config/Config');

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

// listing all post categories
const getAllPostCategories = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const categories = await pool.request()
            .execute('get_all_post_categories_proc');
        return res.status(200).json({
            categories: categories.recordset
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Updatinf post category
const updateCategoryController = async (req, res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Name is required'
            });
        }

        const pool = await mssql.connect(sqlConfig);

        // checking if the category exist
        const category = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_category_by_id_proc');

        if (category.recordset.length === 0) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // updating the category
        const updatedCategory = await pool.request()
            .input('id', mssql.VarChar, id)
            .input('name', mssql.VarChar, name)
            .execute('update_post_category_proc');

        return res.status(200).json({
            message: 'Category updated successfully',
        });


    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Delete post category
const deleteCategoryController = async (req, res) => {
    try {
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // checking if the category exist
        const category = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_category_by_id_proc');

        if (category.recordset.length === 0) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // deleting the category
        const deletedCategory = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('delete_post_category_proc');

        return res.status(200).json({
            message: 'Category deleted successfully',
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}


const getPostByCategory = async (req, res) => {
    try {
        const {id} = req.params;

        const pool = await mssql.connect(sqlConfig);

        // checking if the category exist
        const category = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_category_by_id_proc');

        if(category.recordset.length === 0) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // getting posts from category
        const posts = await pool.request()
            .input('category_id', mssql.VarChar(50), id)
            .execute('get_all_posts_of_category_proc');

        return res.status(200).json({
            posts: posts.recordset
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}



module.exports = {
    createPostCategoryController,
    getAllPostCategories,
    updateCategoryController,
    deleteCategoryController,
    getPostByCategory
}