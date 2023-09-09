require('dotenv').config();

const emailConfigs = {
    host: 'smtp.gmail.com',
    service : 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
}

module.exports = emailConfigs;