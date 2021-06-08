const Joi = require('@hapi/joi');
const validateRequest = require('src/_middleware/validate-request');

function createRoomSchema(req, res, next) {

    const schema = Joi.object({
        name: Joi.string().required(), 
        privacy: Joi.string().required()
    });
    validateRequest(req, next, schema);

}

module.exports = {
    createRoomSchema
};