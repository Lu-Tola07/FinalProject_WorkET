const Joi = require("@hapi/joi");

const schema = Joi.object({
    password: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
    .messages({
      "any.required": "Please provide a password.",
      "string.empty": "Password cannot be left empty.",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
    }),
    oldPassword: Joi.string().required().messages({
        'string.empty': 'Please provide your old password.',
        'any.required': '"oldPassword" is not allowed'
    }),
    newPassword: Joi.string().required().messages({
        'string.empty': 'Please provide a new password.',
        'any.required': '"newPassword" is not allowed'
    }),
    confirmNewPassword: Joi.string().required().messages({
        'string.empty': 'Please confirm your new password.',
        'any.required': '"confirmNewPassword" is not allowed'
    })
});

const validatePassword = (req, res, next) => {
    const {error} = schema.validate(req.body, {abortEarly: false});

    if(error) {
        return res.status(400).json({
            errors: error.details.map(detail => detail.message)
        })
    }

    next()
};

module.exports = {validatePassword}