const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if(!token) {
            return res.status(403).json({
                message: "Access denied"
            });
        } else {
            const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded_token;
            next();
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    verifyToken
}