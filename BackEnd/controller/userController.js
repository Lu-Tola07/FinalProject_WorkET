const userModel = require('../model/userModel');
const staffModel = require('../model/staffModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {welcomeEmail} = require('../helpers/mailTemplate');
const sendMail = require('../helpers/email');
const fs = require('fs');
const path = require('path');


exports.createUser = async (req, res) => {
    try {
        const {fullName, nameOfCompany, phoneNumber, email, passWord, profilePicture, staff} = req.body;
       
        const emailExist = await userModel.findOne({email: email.toLowerCase()}); 
        if (emailExist) {
            return res.status(400).json({
                error: "This email account already exists."
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passWord, salt);

        const data = {
            fullName,
            nameOfCompany,
            phoneNumber,
            email: email.toLowerCase(),
            passWord: hashedPassword,
            profilePicture,
            staff
        };

        const newUser = await userModel.create(data);
       
        const userToken = jwt.sign(
            {id: newUser._id, email: newUser.email},
            process.env.jwtSecret,
            {expiresIn: "3m"}
        );

        // Save the token to the user's record in the database
        newUser.token = userToken;
        await newUser.save();

        const verifyLink = `${req.protocol}://${req.get("host")}/api/v1/verify/${newUser._id}/${userToken}`
        // const verifyLink = `${req.protocol}://${req.get('host')}/api/v1/login/${newUser._id}/${userToken}`;
        
        sendMail({
            subject: "Kindly verify your mail.",
            email: newUser.email,
            html: welcomeEmail(verifyLink, newUser.nameOfCompany)
        });

        res.status(201).json({
            message: `Welcome ${nameOfCompany}, kindly check your email to access the link to log in.`,
            data: newUser,
            token: userToken
        });
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const {token} = req.params;
        const user = await userModel.findOne({
            verificationToken: token
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token."
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({
            message: "Email verified successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const user = await userModel.find().sort({createdAt: -1});
        const allUsers = user.length;

        if(allUsers < 1) {
            res.status(404).json(`No user was found.`)
        } else {
            res.status(200).json({
                message: `These are the number of users available.`,
                allUsers,
                data: user
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.getAUser = async (req, res) => {
    try {
        const oneUser = await userModel.findById(req.params.id).populate("staff");
        const totalUsers = oneUser.staff.length;
        res.status(200).json({
            message: `The user with the ID: ${oneUser.id} has been found. They are ${totalUsers} in number.`,
            totalUsers,
            data: oneUser 
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.deleteAUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteUser = await userModel.findByIdAndDelete(id);

        if(!deleteUser) {
            res.status(404).json({
                message: "The user was not found."
            })
        } else {
            res.status(201).json({
                message: "This user has successfully been deleted."
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.logIn = async (req, res) => {
    try {
        const {email, passWord} = req.body;
        
        const findUser = await userModel.findOne({
            $or: [{nameOfCompany: email}, {email: email.toLowerCase()}]
        });

        if (!findUser) {
            return res.status(404).json({
                message: 'The user with this email does not exist.'
            });
        }

        const matchPassword = await bcrypt.compare(passWord, findUser.passWord);
        
        if (!matchPassword) {
            return res.status(400).json({
                message: 'Invalid password.'
            });
        }

        if (findUser.isVerified === false) {
            return res.status(400).json({
                message: 'The user with this email is not verified.'
            });
        }

        findUser.isLoggedIn = true;
        
        const user = jwt.sign({
            nameOfCompany: findUser.nameOfCompany,
            email: findUser.email,
            userId: findUser._id
        }, process.env.jwtSecret, {expiresIn: "1d"});

        const {isVerified, createdAt, updatedAt, __v, ...others} = findUser._doc;

        return res.status(200).json({
            message: 'Logged in successfully.',
            data: others,
            token: user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const Id = req.params.id
        const findUser = await userModel.findById(Id);

        jwt.verify(req.params.token, process.env.jwtSecret, (err) => {
            if(err) {

                const link = `${req.protocol}://${req.get("host")}/api/v1/verify/${verify._id}/${token}`;
                sendMail({
                    subject: `Kindly verify your mail.`,
                    email: findUser.email,
                    html: welcomeEmail(link, findUser.nameOfCompany)
                });

            } else {
                if(findUser.isVerified == true) {
                    return res.status(400).json(`Your account has already been verified.`)
                };

                userModel.findByIdAndUpdate(Id, {isVerified: true});
        
                res.status(200).json({
                    message: `You have been verified, kindly go ahead and log in.`})
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    };
};

exports.reverifyEmail = async (req, res) => {
    try {
        const {email} = req.body;
        // const user = await userModel.findById(req.params.id);
        const user = await userModel.findOne({email: email.toLowerCase()});
        if(!user) {
            return res.status(404).json({
                error: "User not found."
            })
        }

        if(user.isVerified) {
            return res.status(404).json({
                error: "User already verified."
            })
        }

        const userToken = jwt.sign(
            {id:createdUser._id, email:createdUser.email},
            process.env.jwtSecret,
            {expiresIn: "2 minutes"}
        );
        const reverifyLink = `${req.protocol}://${req.get("host")}/api/v1/verify/${user._id}/${userToken}`;
        const link = sendMail({
            subject: `Kindly re-verify your mail.`,
            email: user.email,
            html: welcomeEmail(reverifyLink, user.nameOfCompany)
        })

        const mailOptions = {
            subject: `Kindly re-verify your mail.`,
            email: user.email,
            html: `Please click on the link to verify your mail: <a href="">Verify Email</a>`
        }
        
        await sendMail(mailOptions);

        res.status(200).json({
            message: "Verication mail sent."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })  
    }
};

exports.logOut = async (req, res) => {
    try {
        const {userId} = req.user;
        const user = await userModel.findByIdAndUpdate(userId, {token: null}, {new: true});
        if(!user) {
            return res.status(404).json({
                message: "User not found."
            })
        }
        
        res.status(200).json({
            message: "The user has been logged out."
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })  
    }
};
