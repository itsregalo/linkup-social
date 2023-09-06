const mssql = require('mssql');
const bcrypt = require('bcrypt'); // for hashing passwords
const jwt = require('jsonwebtoken'); // for generating JWTs
const {v4} = require('uuid'); // for generating UUIDs
const sqlConfig = require('../Config/Config');
const { userRegistrationValidator, userUpdateValidateor } = require('../Validators/AuthenticationValidators');

const userRegistrationController = async (req, res) => {
    try {
        const {email, username, full_name, password, repeat_password} = req.body;

        // checking if the fields are empty
        if(!(email && username && full_name && password && repeat_password)) {
            return res.status(400).json({
                message:"All input is required"
            });
        }

        // checking if the passwords match
        if(password !== repeat_password) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        const {error} = userRegistrationValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            })
        }

        // creating a pool of connections
        const pool = await mssql.connect(sqlConfig);

        // checking if the user already exists
        const user = await pool.request()
            .input('username', mssql.VarChar, username)
            .input('email', mssql.VarChar, email)
            .execute('get_user_by_username_or_email_proc');

        if(user.recordset.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const new_user_id = v4();
        // inserting the user into the database
        const new_user = await pool.request()
            .input('id', mssql.VarChar, new_user_id)
            .input('email', mssql.VarChar, email)
            .input('username', mssql.VarChar, username)
            .input('full_name', mssql.VarChar, full_name)
            .input('password', mssql.VarChar, hashedPassword)
            .execute('first_time_registration_proc');

        // generating a JWT
        const token = jwt.sign(
            {id: new_user_id},
            process.env.TOKEN_SECRET,
            {expiresIn: '1h'}
        );

        return res.status(200).json({
            token,
            user: {
                id: new_user_id,
                email: email,
                username: username,
                full_name: full_name
            },
            message: "User created successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        // checking if the fields are empty
        if(!(email && password)) {
            return res.status(400).json({
                message:"All input is required"
            });
        }

        // creating a pool of connections
        const pool = await mssql.connect(sqlConfig);

        // checking if the user already exists
        const user = await pool.request()
            .input('email', mssql.VarChar, email)
            .execute('get_user_by_email_proc');

        if(user.recordset.length === 0) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        // checking if the passwords match
        const validPassword = await bcrypt.compare(password, user.recordset[0].password);
        if(!validPassword) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        // generating a JWT
        const token = jwt.sign(
            {id: user.recordset[0].id},
            process.env.TOKEN_SECRET,
            {expiresIn: '1h'}
        );

        return res.status(200).json({
            token,
            user: {
                id: user.recordset[0].id,
                email: user.recordset[0].email,
                username: user.recordset[0].username,
                full_name: user.recordset[0].full_name
            },
            message: "User logged in successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        }); 
    }
}

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

        // checking if the username is already taken
        const username_taken = await pool.request()
            .input('username', mssql.VarChar, username)
            .execute('get_user_by_username_proc');

        if(username_taken.recordset.length > 0) {
            return res.status(400).json({
                message: "Username is already taken"
            });
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


// controller for getting all users
const adminGetAllUsersController = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig);

        const users = await pool.request()
            .execute('get_all_users_proc');

        res.status(200).json({
            users: users.recordset
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}


module.exports = {
    userRegistrationController,
    loginUser,
    updateUserProfileController,
    adminGetAllUsersController
}