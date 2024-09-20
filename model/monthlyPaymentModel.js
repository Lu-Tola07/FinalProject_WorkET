const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const monthlyPaymentTrackerSchema = new mongoose.Schema ({
    constructor() {
        this.payments = [];
        this.paymentSchema = Joi.object({
            accountName: Joi.string()
                .min(1)
                .max(100)
                .pattern(/^[a-zA-Z0-9\s-]+$/)
                .required()
                .messages({
                    'string.base': 'Account name must be a string.',
                    'string.empty': 'Account name cannot be empty.',
                    'string.min': 'Account name must be at least 1 character long.',
                    'string.max': 'Account name must be less than 100 characters long.',
                    'string.pattern.base': 'Account name contains invalid characters.',
                    'any.required': 'Account name is required.',
                }),
            amount: Joi.number()
                .positive()
                .precision(2)
                .required()
                .messages({
                    'number.base': 'Payment amount must be a number.',
                    'number.positive': 'Payment amount must be a positive number.',
                    'number.precision': 'Payment amount must have up to 2 decimal places.',
                    'any.required': 'Payment amount is required.',
                }),
            date: Joi.date()
                .required()
                .messages({
                    'date.base': 'Date must be a valid date.',
                    'any.required': 'Date is required.',
                }),
        }, {timestamp: true})
    }
});

const monthlyPaymentModel = mongoose.model("payroll", monthlyPaymentTrackerSchema);

module.exports = monthlyPaymentModel;
