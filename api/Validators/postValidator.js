const joi = require('joi');

const postCreateValidator = joi.object({
    content : joi.string().min(5).max(500).required().messages({
        'string.min': 'Content must be at least 5 characters long',
        'string.max': 'Content must be at most 500 characters long',
        'string.empty': 'Content is required'
    })
});

module.exports = {
    postCreateValidator
}