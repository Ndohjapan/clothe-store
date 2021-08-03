const Joi = require("joi");
const joi = require("joi")

function validate_add_cat(cat) {
    const schema = joi.object({
        section: joi.string().min(1).max(50).required(),
        new_category: joi.string().min(1).max(50).required()
    })
    return schema.validate(cat);
}


function validate_add_product(cat) {
    const schema = joi.object({
        name: joi.string().min(5).max(50).required(),
        size: joi.string().max(50).required(),
        isAvailable: joi.string().regex(/(yes)|(no)/),
        category: joi.string().max(50).required(),
        root_category: joi.string().max(50).required(),
        description: joi.string().min(5).max(50).required(),
        price: joi.number().required(),
        slashed_price: joi.number().required(),
    })
    return schema.validate(cat);
}

exports.validate_add_cat = validate_add_cat
exports.validate_add_product = validate_add_product