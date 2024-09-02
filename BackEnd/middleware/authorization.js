require('dotenv').config();
const jwt = require('jsonwebtoken');
const userModel = require("../model/userModel");

exports.authorize = async (req, res, next) => {
    try {
        
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

        if(!token) {
            return res.status(400).json("Incorrect token.")
        }

        await jwt.verify(token, process.env.jwtSecret, (err, user) => {
            if(err) {
                return res.status(400).json("Kindly login to perform this action.")
            }

            req.user = user._id;
        })

        const checkUser = await userModel.findById(req.user);
        // console.log(checkUser);
        if(checkUser.isAdmin == false) {
            res.status(401).json("You are not allowed to perform this action.")
        } else {
            next()
        }

        // if(checkUser.isSuperAdmin == false) {
        //     res.status(401).json("You are not allowed to perform this action.")
        // } else {
        //     next()
        // }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.checkAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user);

        if(!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if(user.isAdmin == true) {
            next()
        } else {
            return res.status(403).json({
                message: "Access forbidden."
            });
        }
        
        } catch (error) { 
            return res.status(500).json({
                message: error.message
            })
        }
};