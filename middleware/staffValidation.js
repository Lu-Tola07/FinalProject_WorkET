const Joi = require("@hapi/joi");

const schema = Joi.object({
    fullName: Joi.string().min(3).trim().required().pattern(/^[A-Z][a-zA-Z'-]+( [A-Z]\.)?( [A-Z][a-zA-Z'-]+)+$/)
    .messages({
        "any.required": "Please provide fullname.",
        "string.empty": "Fullname cannot be left empty.",
        "string.min": "Fullname must be at least 3 characters long.",
        "string.pattern.base": "Fullname must follow the correct format and begin with a capital letter."
    }),
    // nameOfCompany: Joi.string().min(3).required().messages({
    //     "any.required": "Please provide Name Of Company.",
    //     "string.empty": "Name Of Company cannot be left empty.",
    //     "string.min": "Name Of Company must be at least 3 characters long."
    // }),
    gender: Joi.string().valid("Male", "Female").required().messages({
        "any.required": "Please provide a gender.",
        "any.only": "Gender must be either Male or Female.",
        "string.empty": "Gender cannot be left empty.",
    }),
    // email: Joi.string().email().required().messages({
    //     "any.required": "Please provide an email address.",
    //     "string.empty": "Email cannot be left empty.",
    //     "string.email": "Please provide a valid email address."
    // }),
    email: Joi.string().email({minDomainSegments: 2}).required().messages({
        "any.required": "Please provide an email address.",
        "string.empty": "Email cannot be left empty.",
        "string.base": "Email must be a string.",
        "string.email": "Please provide a valid email address."
    }),
    // password: Joi.string().required().pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$")).messages({
    //     "any.required": "Please provide a password.",
    //     "string.empty": "Password cannot be left empty.",
    //     "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
    // }),
    password: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
    .messages({
      "any.required": "Please provide a password.",
      "string.empty": "Password cannot be left empty.",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
    }),
    // password: Joi.string().optional()
    // .regex(/^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%^&(),.?":{}|<>])[A-Za-z0-9!@#$%^&(),.?":{}|<>]{8,50}$/)
    // .messages({
    //     "any.required": "Please provide a password.",
    //     "string.empty": "Password cannot be left empty.",
    //     "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    //     "string.empty": "Password cannot be empty, must be at least 8 character maximum of 50 characters."
    // }),
    role: Joi.string().min(3).required().messages({
        "any.required": "Please provide a role.",
        "string.empty": "The role cannot be left empty.",
        "string.min": "Role must be at least 3 characters long."
    }),
    address: Joi.string()
    // .min(3).required().messages({
    //     "any.required": "Please provide an address.",
    //     "string.empty": "Address cannot be left empty.",
    //     "string.min": "Address must be at least 3 characters long."
    .min(5)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s,.'-]+$/) // allows letters, numbers, spaces, and some special characters
    .required()
    .messages({
        "string.base": "Address must be a string.",
        "string.empty": "Address cannot be empty.",
        "string.min": "Address must be at least 5 characters long.",
        "string.max": "Address must be less than 100 characters long.",
        "string.pattern.base": "Address contains invalid characters.",
        "any.required": "Address is required."
    }),
    phoneNumber: Joi.string().length(11).required().regex(/^(?:\+234|0)(70|80|81|90|91)[0-9]{8}$/)
    .pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/) 
    .messages({
        "any.required": "Please provide a phone number.",
        "string.empty": "Phone number cannot be left empty.",
        "string.length": "Phone number must be exactly 11 characters long.",
        "string.pattern.base": "Phone number must be a valid Nigerian number."
    }),
    bank: Joi.string().min(3).max(50).required().messages({
        "any.required": "Please provide a bank name.",
        "string.empty": "Bank name cannot be left empty.",
        "string.min": "Bank name must be at least 3 characters long."
    }),
    accountName: Joi.string()
    // .min(3).required().messages({
    //     "any.required": "Please provide an account name.",
    //     "string.empty": "Account name cannot be left empty.",
    //     "string.min": "Account name must be at least 3 characters long."
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s-]+$/) // allows letters, numbers, spaces, and hyphens
    .required()
    .messages({
        "string.base": "Account name must be a string.",
        "string.empty": "Account name cannot be empty.",
        "string.min": "Account name must be at least 1 character long.",
        "string.max": "Account name must be less than 100 characters long.",
        "string.pattern.base": "Account name contains invalid characters.",
        "any.required": "Account name is required."
    }),
    accountNumber: Joi.string().alphanum().min(8).max(12).required()
    .messages({
            // "any.required": "Please provide an account number.",
            // "string.empty": "Account number cannot be left empty.",
            // "string.length": "Account number must be exactly 10 digits long.",
            // "string.pattern.base": "Account number must contain only digits."
            "string.base": "Account number must be a string.",
            'string.empty': 'Account number cannot be empty.',
            "string.min": "Account number must be at least 8 characters long.",
            "string.max": "Account number must be less than 12 characters long.",
            "string.alphanum": "Account number must be alphanumeric.",
            "any.required": "Account number is required."
        }),
    monthlyGross: Joi.number()
    // .greater(0).required().messages({
    //     "any.required": "Please provide a monthly gross sum.",
    //     "number.base": "The monthly gross sum must be a number.",
    //     "number.greater": "The monthly gross sum must be greater than 0."
    .positive()
    .precision(2)
    .required()
    .messages({
        "number.base": "Monthly gross must be a number.",
        "number.positive": "Monthly gross must be a positive number.",
        "number.precision": "Monthly gross must have up to 2 decimal places.",
        "any.required": "Monthly gross is required."
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

const validateStaff = (req, res, next) => {
    const {error} = schema.validate(req.body, {abortEarly: false});

    if(error) {
        return res.status(400).json({
            errors: error.details.map(detail => detail.message)
        })
    }

    next()
};

module.exports = {validateStaff};