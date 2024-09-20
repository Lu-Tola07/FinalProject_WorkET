require('dotenv').config();
const mongoose = require('mongoose');
const monthlyPaymentModel = require('../model/monthlyPaymentModel'); // Adjust the path as needed
const staffModel = require('../model/staffModel');
const sendMail = require('../helpers/email');

exports.processBulkPayment = async (req, res) => {
    const { staffIds, amount, status} = req.body;

    if(!staffIds || !amount) {
        return res.status(400).json({
            message: "Please provide staff IDs and amount."
        })
    };

    try {
        let staffToUpdate = [];

        // If staffIds is "all", find all staff members
        if(staffIds === "all") {
            staffToUpdate = await staffModel.find(); // Fetch all staff
        } else if (Array.isArray(staffIds)) {
            // If staffIds is an array, find only the provided staff members
            staffToUpdate = await staffModel.find({
                _id: {$in: staffIds}
            })
        } else {
            // Invalid input case
            return res.status(400).json({
                message: "Invalid input. Provide 'all' or an array of staff IDs."
            })
        };

        if(staffToUpdate.length === 0) {
            return res.status(404).json({
                message: "No staff found."
            })
        };

        // Process the payment for each staff
        const updatedStaff = await Promise.all(staffToUpdate.map(async (staff) => {
            staff.monthlyPayments.push({
                amount,
                status
            })
            await staff.save();
            
            // const mailOptions = {
            //     from: process.env.mailUser, // sender address
            //     to: staff.email, // staff email address
            //     subject: "Payment Processed",
            //     text: `Hello ${staff.fullName},
            //     \n\nYour payment of ${amount} has been processed with status: ${status}.
            //     \n\nThank you!`
            // };

            // await transporter.sendMail(mailOptions);

            return staff;
        }
    ))

        res.status(200).json({
            message: "Payments processed successfully.", data: updatedStaff
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while processing payments."
        })
    }
};

exports.confirmPaymentStatus = async (req, res) => {
    const { staffId, paymentId } = req.body;

    if(!staffId || !paymentId) {
        return res.status(400).json({
            message: "Please provide staff ID and payment ID."
        })
    };

    try {
        // Find the staff member by ID
        const staff = await staffModel.findById(staffId);
        
        if(!staff) {
            return res.status(404).json({
                message: "Staff not found."
            })
        };

        // Find the payment in the monthlyPayments array
        const payment = staff.monthlyPayments.id(paymentId);
        
        if(!payment) {
            return res.status(404).json({
                message: "Payment not found."
            })
        };

        // Check if the payment status is 'Pending'
        if(payment.status === "Pending") {
            // Update the status to 'Completed'
            payment.status = "Completed";
            await staff.save();

            res.status(200).json({
                message: "Payment status updated successfully.",
                data: payment
            })
        } else {
            res.status(400).json({
                message: "Payment status is not 'Pending'."
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while confirming payment status."
        })
    }
};



// class PaymentService {
//     // Function to track a monthly payment
//     async trackPayment(accountName, amount, date) {
//         const paymentData = {
//             accountName,
//             amount,
//             date: new Date(date)
//         };

//         // Find or create the payment tracker document
//         let tracker = await MonthlyPaymentTracker.findOne();
//         if (!tracker) {
//             tracker = new MonthlyPaymentTracker();
//         }

//         // Add the new payment to the payments array
//         tracker.payments.push(paymentData);
//         await tracker.save();

//         return paymentData;
//     }
// };

// module.exports = PaymentService;

// const Joi = require('@hapi/joi');

// class MonthlyPaymentTracker {
//     constructor() {
//         this.payments = [];
//         this.paymentSchema = Joi.object({
//             accountName: Joi.string()
//                 .min(1)
//                 .max(100)
//                 .pattern(/^[a-zA-Z0-9\s-]+$/)
//                 .required()
//                 .messages({
//                     'string.base': 'Account name must be a string.',
//                     'string.empty': 'Account name cannot be empty.',
//                     'string.min': 'Account name must be at least 1 character long.',
//                     'string.max': 'Account name must be less than 100 characters long.',
//                     'string.pattern.base': 'Account name contains invalid characters.',
//                     'any.required': 'Account name is required.',
//                 }),
//             amount: Joi.number()
//                 .positive()
//                 .precision(2)
//                 .required()
//                 .messages({
//                     'number.base': 'Payment amount must be a number.',
//                     'number.positive': 'Payment amount must be a positive number.',
//                     'number.precision': 'Payment amount must have up to 2 decimal places.',
//                     'any.required': 'Payment amount is required.',
//                 }),
//             date: Joi.date()
//                 .required()
//                 .messages({
//                     'date.base': 'Date must be a valid date.',
//                     'any.required': 'Date is required.',
//                 }),
//         });
//     }

//     // Function to add a monthly payment
//     addPayment(accountName, amount, date) {
//         const paymentData = { accountName, amount, date };

//         // Validate payment data
//         const { error } = this.paymentSchema.validate(paymentData);
//         if (error) {
//             throw new Error(error.details[0].message);
//         }

//         // Convert date to Date object
//         paymentData.date = new Date(date);

//         this.payments.push(paymentData);
//         return paymentData;
//     }

//     // Function to get all payments
//     getPayments() {
//         return this.payments;
//     }

//     // Function to track payments for a specific account
//     getPaymentsForAccount(accountName) {
//         return this.payments.filter(payment => payment.accountName === accountName);
//     }

//     // Function to calculate total payments for a specific account
//     getTotalPaymentsForAccount(accountName) {
//         return this.getPaymentsForAccount(accountName)
//             .reduce((total, payment) => total + payment.amount, 0);
//     }

//     // Function to get payments for the current month
//     getPaymentsForCurrentMonth() {
//         const now = new Date();
//         return this.payments.filter(payment => {
//             return payment.date.getFullYear() === now.getFullYear() &&
//                    payment.date.getMonth() === now.getMonth();
//         });
//     }
// }

// // Example Usage
// const paymentTracker = new MonthlyPaymentTracker();

// try {
//     // Add payments
//     paymentTracker.addPayment('John Doe', 1500.00, '2024-09-05');
//     paymentTracker.addPayment('Jane Smith', 2000.00, '2024-09-15');
//     paymentTracker.addPayment('John Doe', 1000.00, '2024-09-20');

//     // Get all payments
//     console.log('All Payments:', paymentTracker.getPayments());

//     // Get payments for a specific account
//     console.log('Payments for John Doe:', paymentTracker.getPaymentsForAccount('John Doe'));

//     // Get total payments for a specific account
//     console.log('Total Payments for John Doe:', paymentTracker.getTotalPaymentsForAccount('John Doe'));

//     // Get payments for the current month
//     console.log('Payments for Current Month:', paymentTracker.getPaymentsForCurrentMonth());

// } catch (error) {
//     console.error('Error:', error.message);
// }

// const paymentService = new PaymentService();

// (async () => {
//     try {
//         // Track a payment
//         const payment = await paymentService.trackPayment('John Doe', 1500.00, '2024-09-05');
//         console.log('Payment tracked:', payment);
        
//         // You can track more payments as needed
//         await paymentService.trackPayment('Jane Smith', 2000.00, '2024-09-15');
//     } catch (error) {
//         console.error('Error tracking payment:', error.message);
//     } finally {
//         await mongoose.disconnect();
//     }
// })();
