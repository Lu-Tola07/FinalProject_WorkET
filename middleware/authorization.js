require('dotenv').config();
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const staffModel = require('../model/staffModel')


const authenticate = async (req, res, next) => {
    try {
        const hasAuthorization = req.headers.authorization;
        if(!hasAuthorization) {
            return res.status(400).json({
                message: "Invalid authorization."
            })
        }
        const token = hasAuthorization.split(" ")[1];
        // console.log('this is the token',token)
        if(!token) {
            return res.status(404).json({
                message: "Token not found.",
            })
        }
        
        const decodeToken = await jwt.verify(token, process.env.jwtSecret);
        console.log('this is the user',decodeToken)

        let user;
        user = await userModel.findById(decodeToken.userId);
        if(!user) {
            user = await staffModel.findById(decodeToken.userId);
            console.log('this is the staff',user)
            if(!user) {
                return res.status(404).json({
                    message: "Not authorized: User not found."
                })
            }
        }
        // req.user = {
        //     userId: user._id,
        //     decodeToken
        // }
        req.user = user.id;
        console.log('this is the user id',req.user)


        next();
        
    } catch (error) {
        console.error(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Invalid or expired token, please login to continue.",
            })
        }

        return res.status(500).json({
            Error: "Authentication error:  " + error.message,
        })        
    }
};

const authenticated = async (req, res, next) => {
    try {
        const {email} = req.user;
        const staff = await staffModel.findOne({email: email.toLowerCase()});
        if (!staff.isPasswordChanged) {
            return res.status(400).json({
                message: "Kindly change your password."
            });

        }
        next();

    } catch (error) {
        return res.status(500).json({
            Error: "Authentication error:  " + error.message,
        })        
    }
};

const makeAdmin = (req, res, next) => {
    authenticate(req, res, async () => {
        if(req.user.isAdmin) {
            next()
        } else {
            return res.status(400).json({
                message: "Not an Admin! User not authorized."
            })
        }
    })
}


module.exports = {
    authenticate,
    authenticated,
    makeAdmin,

}

// exports.checkAdmin = async (req, res, next) => {
//     try {
//         const user = await staffModel.findById(req.user);

//         if(!user) {
//             return res.status(404).json({
//                 message: "User not found."
//             });
//         }

//         if(user.isAdmin == true) {
//             next()
//         } else {
//             return res.status(403).json({
//                 message: "Access forbidden."
//             });
//         }
        
//         } catch (error) { 
//             return res.status(500).json({
//                 message: error.message
//             })
//         }
// };

// exports.authorize = async (req, res, next) => {
//     try {
        
//         const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

//         if(!token) {
//             return res.status(400).json("Incorrect token.")
//         }

//         await jwt.verify(token, process.env.jwtSecret, (err, user) => {
//             if(err) {
//                 return res.status(400).json("Kindly login to perform this action.")
//             }

//             req.user = user._id;
//         })

//         const checkUser = await userModel.findById(req.user);
//         // console.log(checkUser);
//         if(checkUser.isAdmin == false) {
//             res.status(401).json("You are not allowed to perform this action.")
//         } else {
//             next()
//         }

//         // if(checkUser.isSuperAdmin == false) {
//         //     res.status(401).json("You are not allowed to perform this action.")
//         // } else {
//         //     next()
//         // }

//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// };


// exports.authorizeSuper = async (req, res, next) => {
//     try {
        
//         const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

//         // console.log(token)
//         if(!token) {
//             return res.status(400).json("Something went wrong, incorrect token.")
//         }

//         await jwt.verify(token, process.env.jwtSecret, (err, user) => {
//             if(err) {
//                 return res.status(400).json("Kindly login to perform this action.")
//             }

//             req.user = user._id;
//         })

//         const checkUser = await userModel.findById(req.user);
//         if(checkUser.isSuperAdmin == false) {
//             res.status(401).json("You are not allowed to perform this action.")
//         } else {
//             next()
//         }

//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// };