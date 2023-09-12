const mssql = require('mssql');
const bcrypt = require('bcrypt'); // for hashing passwords
const jwt = require('jsonwebtoken'); // for generating JWTs
const {v4} = require('uuid'); // for generating UUIDs
const nodemailer = require('nodemailer'); // for sending emails
const sqlConfig = require('../../Config/Config');
const { userRegistrationValidator, userUpdateValidateor, forgotPasswordValidator } = require('../../Validators/AuthenticationValidators');
const emailConfigs = require('../../Config/EmailConfig');

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
        const salt = await bcrypt.genSalt(10); // generating a salt 
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

        // sending the email
        try{
            const transporter = nodemailer.createTransport({
                host: emailConfigs.host,
                service : emailConfigs.service,
                port: emailConfigs.port,
                secure: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                },
                
            tls: {
                rejectUnauthorized: false
            }
            });
    
            // sending the email
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Account activation',
                html: `
                    <h2>Click on the link below to activate your account</h2>
                    <p>
                    <button>
                        <a href="${process.env.CLIENT_URL}/activate/${token}">Activate account</a>
                    </button>
                    </p>
                `
            }
    
            transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    return res.status(400).json({
                        message: error.message
                    });
                } else {
                    return res.status(200).json({
                        message: "Email sent successfully"
                    });
                }
            }
            );
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(201).json({
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
            .execute('get_all_details_by_email_proc');

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

const forgotPasswordController = async (req, res) => {
    try {
        const {email} = req.body;

        // validating the email
        if(!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const {error} = forgotPasswordValidator.validate(req.body);

        if(error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        }

        // creating a pool
        const pool = await mssql.connect(sqlConfig);

        // checking if the user exists
        const user = await pool.request()
            .input('email', mssql.VarChar, email)
            .execute('get_all_details_by_email_proc');

        if(user.recordset.length === 0) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        // generating a JWT
        const token = jwt.sign(
            {id: user.recordset[0].id},
            process.env.TOKEN_SECRET,
            {expiresIn: '20m'}
        );

        // sending the email
        const transporter = nodemailer.createTransport({
            host: emailConfigs.host,
            service : emailConfigs.service,
            port: emailConfigs.port,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            },
            
        tls: {
            rejectUnauthorized: false
        }
        });


        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset password',
            html: `
                <h2>Click on the link below to reset your password</h2>
                <p>
                <button>
                    <a href="${process.env.CLIENT_URL}/reset-password/${token}">Reset password</a>
                </button>
                </p>
            `
        }

        // updating the reset token
        try {
            const create_reset_token = await pool.request()
                .input('id', mssql.VarChar, v4())
                .input('user_id', mssql.VarChar, user.recordset[0].id)
                .input('reset_token', mssql.VarChar, token)
                .execute('create_reset_token_proc');
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                return res.status(400).json({
                    message: error.message
                });
            } else {
                return res.status(200).json({
                    message: "Email sent successfully"
                });
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// reset password controller
const resetPasswordController = async (req, res) => {
    try {
        const {reset_token, new_password, repeat_password} = req.body;

        // validating the email
        if(!(reset_token && new_password && repeat_password)) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // checking if the passwords match
        if(new_password !== repeat_password) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        // creating a pool
        const pool = await mssql.connect(sqlConfig);

        // checking if the user exists
        const user = await pool.request()
            .input('reset_token', mssql.VarChar, reset_token)
            .execute('get_user_by_reset_token_proc');
            

        if(user.recordset.length === 0) {
            return res.status(400).json({
                message: "Invalid token"
            });
        }

        // hashing the password
        const salt = await bcrypt.genSalt(10); // generating a salt
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // updating the password
        const updatedUser = await pool.request()
            .input('id', mssql.VarChar, user.recordset[0].id)
            .input('password', mssql.VarChar, hashedPassword)
            .execute('update_user_password_proc');

        return res.status(200).json({
            message: "Password updated successfully"
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

// deleting a user
const deleteUserControllerHard = async (req, res) => {
    try {
        const {id} = req.params;

        // creating a pool
        const pool = await mssql.connect(sqlConfig);

        //checking if the user exists
        const user = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_user_by_id_proc');
        
        if(user.recordset.length === 0) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        // deleting the user
        const deletedUser = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('delete_user_proc');

        return res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const basicUserDetails = async (req, res) => {
    try {
        const {id} = req.params;

        // creating a pool
        const pool = await mssql.connect(sqlConfig);

        //checking if the user exists
        const user = await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('get_user_by_id_proc');

        if(user.recordset.length === 0) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        return res.status(200).json({
            user: {
                id: user.recordset[0].id,
                email: user.recordset[0].email,
                username: user.recordset[0].username,
                full_name: user.recordset[0].full_name,
                profile_picture: user.recordset[0].profile_picture,
            }
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    userRegistrationController,
    loginUser,
    adminGetAllUsersController,
    forgotPasswordController,
    resetPasswordController,
    deleteUserControllerHard,
    basicUserDetails
}