const Joi = require("@hapi/joi");

const schema = Joi.object({
    fullName: Joi.string().min(3).trim().required().pattern(/^[A-Z][a-zA-Z'-]+( [A-Z]\.)?( [A-Z][a-zA-Z'-]+)+$/)
    .messages({
        "any.required": "Please provide fullname.",
        "string.empty": "Fullname cannot be left empty.",
        "string.min": "Fullname must be at least 3 characters long.",
        "string.pattern.base": "Fullname must be in letters only and follow the correct format."
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
    email: Joi.string().email().required().messages({
        "any.required": "Please provide an email address.",
        "string.empty": "Email cannot be left empty.",
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
    address: Joi.string().min(3).required().messages({
        "any.required": "Please provide an address.",
        "string.empty": "Address cannot be left empty.",
        "string.min": "Address must be at least 3 characters long."
    }),
    phoneNumber: Joi.string().length(11).required().regex(/^(?:\+234|0)(70|80|81|90|91)[0-9]{8}$/)
    .messages({
        "any.required": "Please provide a phone number.",
        "string.empty": "Phone number cannot be left empty.",
        "string.length": "Phone number must be exactly 11 characters long.",
        "string.pattern.base": "Phone number must be a valid Nigerian number."
    }),
    bank: Joi.string().min(3).required().messages({
        "any.required": "Please provide a bank name.",
        "string.empty": "Bank name cannot be left empty.",
        "string.min": "Bank name must be at least 3 characters long."
    }),
    accountName: Joi.string().min(3).required().messages({
        "any.required": "Please provide an account name.",
        "string.empty": "Account name cannot be left empty.",
        "string.min": "Account name must be at least 3 characters long."
    }),
    accountNumber: Joi.string().length(10).required().pattern(/^\d+$/)
        .messages({
            "any.required": "Please provide an account number.",
            "string.empty": "Account number cannot be left empty.",
            "string.length": "Account number must be exactly 10 digits long.",
            "string.pattern.base": "Account number must contain only digits."
        }),
    monthlyGross: Joi.number().greater(0).required().messages({
        "any.required": "Please provide a monthly gross sum.",
        "number.base": "The monthly gross sum must be a number.",
        "number.greater": "The monthly gross sum must be greater than 0."
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