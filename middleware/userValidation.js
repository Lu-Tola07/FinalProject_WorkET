const Joi = require("@hapi/joi");

const schema = Joi.object({
    fullName: Joi.string().min(3).required().pattern(new RegExp(/^[A-Za-z]+(?: [A-Za-z]+)*$/)).messages({
        "any.required": "Please provide your fullname.",
        "string.empty": "Fullname cannot be an empty string.",
        "string.min": "Fullname must be at least 3 characters long.",
        "string.pattern.base": "Fullname should only contain letters and a single space in between."
    }),
    // fullName: Joi.string().min(3)
    // .trim() // Automatically trims leading and trailing spaces
    // .required()
    // .pattern(/^[A-Z][a-zA-Z'-]+( [A-Z]\.)?( [A-Z][a-zA-Z'-]+)+$/)
    // .messages({
    //     "any.required": "Please provide a fullname.",
    //     "string.empty": "Fullname cannot be left empty.",
    //     "string.min": "Fullname must be at least 3 characters long.",
    //     "string.pattern.base": "Fullname should only contain letters and a single space in between."
    // }),
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
    email: Joi.string().email({minDomainSegments: 2}).required().messages({
        "any.required": "Please provide an email address.",
        "string.empty": "Email cannot be left empty.",
        "string.email": "Please provide a valid email address."
    }),
    // password: Joi.string().pattern(new RegExp("^(?=.[!@#$%^&.])(?=.*[A-Z]).{8,}$")).required()
    // .messages({
    //   "any.required": "Password is required.",
    //   "string.base": "Password must contain at least 8 characters, one capital letter, and one special character (!@#$%^&*.).",
    //   "string.pattern.base":
    //   "Password must contain at least 8 characters, one capital letter, and one special character (!@#$%^&*.)."
    // }),
    // password: Joi.string()
    //   .required()
    //   .min(8)
    //   .max(50)
    //   .regex(
    //     /^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%^&(),.?":{}|<>])[A-Za-z0-9!@#$%^&(),.?":{}|<>]{8,50}$/
    //   )
    //   .messages({
    //     "any.required": "Please enter school password",
    //     "string.pattern.base":
    //       "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    //     "string.empty": "Password cannot be empty",
    //     "string.min": "Password must be at least 8 characters long",
    //     "string.max": "Password cannot be longer than 50 characters",
    //   }),
    // password: Joi.string().optional()
    // .regex(/^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%^&(),.?":{}|<>])[A-Za-z0-9!@#$%^&(),.?":{}|<>]{8,50}$/)
    // .messages({
    //     "any.required": "Please provide a password.",
    //     "string.empty": "Password cannot be left empty.",
    //     "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    //     "string.empty": "Password cannot be empty, must be at least 8 character maximum of 50 characters."
    // }),
    // password: Joi.string()
    //         .pattern(new RegExp("^(?=.[!@#$%^&])(?=.*[A-Z]).{7,}$"))
    //         .required()
    //         .messages({
    //             "any.required": "Please provide a password.",
    //             "string.empty": "Password cannot be left empty.",
    //             "string.pattern.base":
    //                 "Password must be at least 7 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
    //         }),
    password: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
    .messages({
      "any.required": "Please provide a password.",
      "string.empty": "Password cannot be left empty.",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
    }),
    confirmPassword: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
    .messages({
      "any.required": "Please provide a password.",
      "string.empty": "Password cannot be left empty.",
      "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
    }),
    // phoneNumber: Joi.string().min(11).max(11).required().regex(/^(?:\+234|0)(70|80|81|90|91)[0-9]{8}$/)
    // .messages({
    //     "any.required": "Please provide Phone Number.",
    //     "string.empty": "Phone Number cannot be left empty.",
    //     "string.min": "Phone Number must be at least 11 characters long.",
    //     "string.pattern.base": "Phone number must be a valid Nigerian number."
    // })
    phoneNumber: Joi.string().length(11).required().regex(/^(?:\+234|0)(70|80|81|90|91)[0-9]{8}$/)
    // .pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/) 
    .messages({
        "any.required": "Please provide a phone number.",
        "string.empty": "Phone number cannot be left empty.",
        "string.length": "Phone number must be exactly 11 characters long.",
        "string.pattern.base": "Phone number must be a valid Nigerian number."
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