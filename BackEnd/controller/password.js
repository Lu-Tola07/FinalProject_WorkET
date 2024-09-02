require('dotenv').config();
const userModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../helpers/email');
const {welcomeEmail} = require('../helpers/mailTemplate');
const staffModel = require('../model/contentModel'); 

exports.forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const findEmail = await userModel.findOne({email});
        if(!findEmail) {
            return res.status(404).json({
                message: "The user with this email does not exist."
            })
        }

        const name = findEmail.nameOfCompany

        const token = jwt.sign(
            {userId:findEmail._id},
            process.env.jwtSecret,
            {expiresIn:'1d'}
        );

        const verificationLink = `${token}`;
        const html = welcomeEmail(nameOfCompany, verificationLink);
        const emailSubject = "Reset Password."

        const mailOptions = {
            from: process.env.user,
            to: email,
            subject: emailSubject,
            html: welcomeEmail
        };

        await sendEmail(mailOptions);

        res.status(200).json({
            message: "Successfully sent email.", token
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.resetPassword = async (req, res) =>{
    try {
        const {token} = req.params;
        const {newPassword, confirmPassword} = req.body;
        if(newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Invalid password."
            })
        }
        
        const decodedToken = jwt.verify(token, process.env.jwtSecret);
        const userId = decodedToken.userId;
        const user = await userModel.findById(userId);
        if(!user) {
            return res.status(404).json({
                message: "User not found."
            })
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hashSync(newPassword, salt);
        user.passWord = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password reset is successful."
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.changePassword = async (req,res)=>{
    try {
        const {token} = req.params;
        
        const {oldPassword, newPassword, confirmNewPassword} = req.body;
        
        const decodedToken = jwt.verify(token, process.env.jwtSecret);
        const userId = decodedToken.userId
    
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message: "User not found."
            })
        }
     
        const matchedPassword = await bcrypt.compare(oldPassword, user.password)
        if(!matchedPassword){
             return res.status(400).json({
                message: "Invalid password."
            })
        }
        
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                message: "New password does not match, kindly confirm new password."
            })
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hashSync(newPassword, salt);
    
        user.passWord = hashedPassword
        await user.save()
        return res.status(200).json({
            message: "Changed password successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};