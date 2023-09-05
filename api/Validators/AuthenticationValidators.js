const joi = require('joi');

const userRegistrationValidator = joi.object({
    email: joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email is required'
    }),
    username: joi.string().min(3).max(20).required().messages({
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must be at most 20 characters long',
        'string.empty': 'Username is required'
    }),
    full_name: joi.string().min(6).max(50).required().messages({
        'string.min': 'Full name must be at least 6 characters long',
        'string.max': 'Full name must be at most 50 characters long',
        'string.empty': 'Full name is required'
    }),
    password: joi.string().min(6).max(20).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password must be at most 20 characters long',
        'string.empty': 'Password is required'
    }),
    repeat_password: joi.ref('password')
});


module.exports = {
    userRegistrationValidator
}