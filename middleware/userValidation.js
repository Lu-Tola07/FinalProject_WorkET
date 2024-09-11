const Joi = require("@hapi/joi");

const schema = Joi.object({
    fullName: Joi.string().min(3)
    .trim() // Automatically trims leading and trailing spaces
    .required()
    .pattern(/^[A-Z][a-zA-Z'-]+( [A-Z]\.)?( [A-Z][a-zA-Z'-]+)+$/)
    .messages({
        "any.required": "Please provide a fullname.",
        "string.empty": "Fullname cannot be left empty.",
        "string.min": "Fullname must be at least 3 characters long.",
        "string.pattern.base": "Fullname must be in letters only and follow the correct format."
    }),
    // fullName: Joi.string().min(3).trim().required().pattern(/^[A-Z][a-zA-Z'-]+( [A-Z]\.)?( [A-Z][a-zA-Z'-]+)+$/)
    // .messages({
    //     "any.required": "Please provide fullname.",
    //     "string.empty": "Fullname cannot be left empty.",
    //     "string.min": "Fullname must be at least 3 characters long.",
    //     "string.pattern.base": "Fullname must be in letters only and follow the correct format."
    //     // "string.trimAndNormalize": 'String should not contain leading or trailing spaces and multiple spaces within.'
    // }),
    nameOfCompany: Joi.string().min(3).trim().required().messages({
        "any.required": "Please provide Name Of Company.",
        "string.empty": "Name Of Company cannot be left empty.",
        "string.min": "Name Of Company must be at least 3 characters long."
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Please provide an email address.",
        "string.empty": "Email cannot be left empty.",
        "string.email": "Please provide a valid email address."
    }),
    password: Joi.string().required().pattern(new RegExp("^(?=.[!@#$%^&])(?=.*[A-Z]).{8,}$")).messages({
        "any.required": "Please provide a password.",
        "string.empty": "Password cannot be left empty.",
        "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*)."
    }),
    phoneNumber: Joi.string().min(3).required().messages({
        "any.required": "Please provide Phone Number.",
        "string.empty": "Phone Number cannot be left empty.",
        "string.min": "Phone Number must be at least 3 characters long."
    })
});

// const Joi = require('joi'); // Use the updated 'joi' package

// // Staff schema validation
// const schema = Joi.object({
//     fullName: Joi.string()
//         .required()
//         .pattern(/^[A-Z][a-zA-Z'-]+( [A-Z]\.)?( [A-Z][a-zA-Z'-]+)+$/)
//         .messages({
//             'string.pattern.base': 'Full name must be in letters only and follow the correct format',
//             'string.empty': 'Full name cannot be left empty',
//             'any.required': 'Full name is required'
//         }),

//     email: Joi.string()
//         .trim()
//         .email()
//         .required()
//         .messages({
//             'any.required': 'Please provide an email.',
//             'string.empty': 'Email cannot be left empty.',
//             'string.email': 'Please provide a valid email address.',
//         }),
  
//     password: Joi.string()
//         .trim()
//         .required()
//         .pattern(new RegExp("^(?=.zz])(?=.*[A-Z]).{8,}$"))
//         .messages({
//             'any.required': 'Please provide a password.',
//             'string.empty': 'Password cannot be left empty.',
//             'string.pattern.base': 'Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).',
//         }),
// });

// const validate = (req, res, next) => {
//     const {error} = schema.validate(req.body, {abortEarly: false});(.().({ : .details.map(detail => detail.message) });
//     }

//     next();
// };

// module.exports = { validate };

const validateSignUp = (req, res, next) => {
    const {error} = schema.validate(req.body, {abortEarly: false});

    if(error) {
        return res.status(400).json({
            errors: error.details.map(detail => detail.message)
        })
    }

    next()
};

module.exports = {validateSignUp};