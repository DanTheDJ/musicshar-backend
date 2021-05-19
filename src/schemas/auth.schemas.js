const Joi = require('@hapi/joi');
const validateRequest = require('src/_middleware/validate-request');

function registerAccountSchema(req, res, next) {

    const schema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);

}

module.exports = {
    registerAccountSchema
};