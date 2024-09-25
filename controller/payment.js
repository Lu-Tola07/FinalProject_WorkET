require('dotenv').config();
const mongoose = require('mongoose');
const staffModel = require('../model/staffModel');
const userModel = require('../model/userModel');
const nodemailer = require('nodemailer');



exports.paymentNotifications = async (req, res) => {
    try {
        const { userId, staffId, paymentDetails } = req.body;

        const user = await userModel.findById(userId);
        if(!user) {
            return res.status(400).json({
                message: "User not found."
            })
        }

        const staff = await staffModel.findById(staffId);
        if(!staff) {
            return res.status(400).json({
                message: "Staff not found."
            })
        }

        const userMailOptions = {
            from: process.env.mailUser,
            to: user.email,
            subject: 'Payment Confirmation',
            text: `Dear ${user.fullName},
            \n\nYour payment of $${paymentDetails.amount} has been successfully processed on ${paymentDetails.date}.
            \n\nThank you for your business!
            \n\nBest regards,\nTeam WorkET`
        };

        const staffMailOptions = {
            from: process.env.mailUser,
            to: staff.email,
            subject: 'Payment Notification',
            text: `Dear ${staff.fullName},
            \n\nA payment of $${paymentDetails.amount} has been sent to you on ${paymentDetails.date}.
            \n\nThank you for your service!
            \n\nBest regards,\nTeam WorkET`
        };

        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(staffMailOptions);
        console.log(`Payment confirmation sent to ${user.email} and notification sent to ${staff.email}`);

        return res.status(200).json({
            success: true,
            message: "Notifications sent successfully."
        })

    } catch (error) {
        // console.error('Error sending payment notifications:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};
