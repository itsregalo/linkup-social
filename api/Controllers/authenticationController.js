const mssql = require('mssql');
const bcrypt = require('bcrypt'); // for hashing passwords
const jwt = require('jsonwebtoken'); // for generating JWTs
const {v4} = require('uuid'); // for generating UUIDs
const sqlConfig = require('../Config/Config');
const { userRegistrationValidator } = require('../Validators/AuthenticationValidators');

const userRegistrationController = async (req, res) => {
    try {
        const {email, username, full_name, password, repeat_password} = req.body;

        // checking if the fields are empty
        if(!(email && username && full_name && password && repeat_password)) {
            res.status(400).send("All input is required");
        }

        // checking if passwords match
        if(password !== repeat_password) {
            res.status(400).send("Passwords don't match");
        }

        const {error} = userRegistrationValidator.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // creating a pool of connections
        const pool = await mssql.connect(sqlConfig);

        // checking if the user already exists
        const user = await pool.request()
            .input('username', mssql.VarChar, username)
            .input('email', mssql.VarChar, email)
            .execute('get_user_by_username_or_email_proc');

        if(user.recordset.length > 0) {
            res.status(400).send("User already exists");
        }

        // hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // inserting the user into the database
        const new_user = await pool.request()
            .input('id', mssql.VarChar, v4())
            .input('email', mssql.VarChar, email)
            .input('username', mssql.VarChar, username)
            .input('full_name', mssql.VarChar, full_name)
            .input('password', mssql.VarChar, hashedPassword)
            .execute('first_time_registration_proc');

        // generating a JWT
        const token = jwt.sign(
            {id: new_user.recordset[0].id},
            process.env.TOKEN_SECRET,
            {expiresIn: '1h'}
        );

        res.status(200).json({
            token,
            user: {
                id: new_user.recordset[0].id,
                email: new_user.recordset[0].email,
                username: new_user.recordset[0].username,
                full_name: new_user.recordset[0].full_name
            },
            message: "User created successfully"
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    userRegistrationController
}