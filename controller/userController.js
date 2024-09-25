const userModel = require('../model/userModel');
const staffModel = require('../model/staffModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {welcomeEmail} = require('../helpers/mailTemplate');
const sendMail = require('../helpers/email');
// const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');


exports.createUser = async (req, res) => {
    try {
        const {fullName, nameOfCompany, phoneNumber, email, password, confirmPassword, staff} = req.body;
       
        if(password !== confirmPassword) {
            return res.status(400).json({
                error: "Passwords do not match."
            })
        };

        const emailExist = await userModel.findOne({email: email.toLowerCase()}); 
        if(emailExist) {
            return res.status(400).json({
                error: "This email account already exists."
            })
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // const {profilePicture} = req.files;
        // if(!profilePicture) {
        //     return res.status(400).json({
        //         message: "No file has been uploaded."
        //     })
        // };
        // let profilePictureData = {};
        // if(req.files && req.files.profilePicture) {
        //     const profilePicture = req.files.profilePicture;
        //     // Validate profile picture type
        //     const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        //     if(!allowedMimeTypes.includes(profilePicture.mimetype)) {
        //         return res.status(400).json({
        //             message: "Please upload a JPEG, PNG, or JPG image."
        //         })
        //     }
        // };
        // console.log(profilePicture.mimeTypes != 'image/jpeg' && 'image/png' && 'image/jpg');

        // // const cloudProfile = await cloudinary.uploader.upload(profilePicture.tempFilePath,
        // //     {folder: "user_dp"});
        // //     profilePictureData = {
        // //         pictureId: cloudProfile.public_id,
        // //         pictureUrl: cloudProfile.secure_url
        // //     }
        // // };


        // // if(profilePicture.mimetypes != "image/jpeg' && 'image/png' && 'image/jpg") {
        // //     return res.status(400).json({
        // //         message: "Please upload a JPEG, PNG, or JPG image."
        // //     })
        // // };
        
        // const cloudProfile = await cloudinary.uploader.upload(req.files.profilePicture.tempFilePath,
        //     {Folder: "user_dp"}, (error, data) => {
        //     if(error) {
        //         return res.status(500).json(error.message)
        //     } else {
        //         return data
        //     }
        // });

        // if(!req.file) {
        //     return res.status(400).json({
        //         message: "Kindly upload your profile picture."
        //     })
        // }

        // const cloudProfile = await cloudinary.uploader.upload(req.file.path,
        //     {folder: "user_dp"}, (err) => {
        //         if(err) {
        //             return res.status(400).json({
        //                 message: error.message
        //             })
        //         }
        //     });

        // if(req.files && req.files.profilePicture) {
        //     const profilePicture = req.files.profilePicture;
        //     // Validate profile picture type
        //     const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        //     if (!allowedMimeTypes.includes(profilePicture.mimetype)) {
        //         return res.status(400).json({
        //             message: "Please upload a JPEG, PNG, or JPG image."
        //         })
        //     };
        //     // Upload to Cloudinary
        //     try {
        //         const cloudProfile = await cloudinary.uploader.upload(profilePicture.tempFilePath,
        //             {folder: "user_dp"}
        //         );

        //         profilePictureData = {
        //             pictureId: cloudProfile.public_id,
        //             pictureUrl: cloudProfile.secure_url
        //         };
            

        //     } catch (error) {
        //         return res.status(500).json({
        //             message: `Cloudinary upload failed: ${uploadError.message}`
        //         })
        //     }
        // } else {
        //     return res.status(400).json({
        //         message: error.message
        //     })
        // };

        // if (req.files && req.files.profilePicture) {
        //     const profilePicture = req.files.profilePicture;
        
        //     // Validate profile picture type
        //     const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        //     if (!allowedMimeTypes.includes(profilePicture.mimetype)) {
        //         return res.status(400).json({
        //             message: "Please upload a JPEG, PNG, or JPG image."
        //         });
        //     }
        
        //     // Upload to Cloudinary
        //     try {
        //         const cloudProfile = await cloudinary.uploader.upload(profilePicture.tempFilePath, {
        //             folder: "user_dp"
        //         });
        
        //         const profilePictureData = {
        //             pictureId: cloudProfile.public_id,
        //             pictureUrl: cloudProfile.secure_url
        //         };
        
        //         // Respond with success and image data
        //         return res.status(200).json({
        //             message: "Profile picture uploaded successfully.",
        //             data: profilePictureData
        //         });
        
        //     } catch (error) {
        //         return res.status(500).json({
        //             message: `Cloudinary upload failed: ${error.message}`
        //         });
        //     }
        // } else {
        //     return res.status(400).json({
        //         message: "No profile picture uploaded."
        //     });
        // }

        const data = {
            fullName: fullName.trim(),
            nameOfCompany: nameOfCompany.trim(),
            phoneNumber,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            // profilePicture: {
            //     pictureId: cloudProfile.public_id,
            //     pictureUrl: cloudProfile.secure_url
            // },
            staff
        };
        

        const newUser = await userModel.create(data);
       
        const userToken = jwt.sign(
            {userId: newUser._id, email: newUser.email},
            process.env.jwtSecret,
            {expiresIn: "1hr"}
        );

        newUser.token = userToken;
        await newUser.save();

        // const verifyLink = `${req.protocol}://${req.get("host")}/api/v1/verify/${newUser._id}/${userToken}`
        const verifyLink = `https://worket-njw4.vercel.app/#/Login`
        // const verifyLink = `${req.protocol}://${req.get('host')}/api/v1/login/${newUser._id}/${userToken}`;
        
        sendMail({
            subject: "Kindly verify your mail.",
            email: newUser.email,
            html: welcomeEmail(verifyLink, newUser.nameOfCompany)
        });

        res.status(201).json({
            message: `Welcome ${newUser.nameOfCompany}, kindly check your email to access the link to log in.`,
            data: newUser,
            token: userToken
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

exports.updateAUser = async (req, res) => {
    try {
        const staffId = req.params.id;
        const {fullName, nameOfCompany, phoneNumber, email, password, profilePicture, staff} = req.body;
        const data = {
            fullName,
            nameOfCompany,
            phoneNumber,
            email,
            password,
            profilePicture,
            staff
        }

        const updatedUser = await userModel.findOneAndUpdate(
            {_id: userId},
            data,
            {new: true}
        );
        
        if(updatedUser) {
            return res.status(200).json({
                message: "This user has been updated.",
                data: updatedUser
            })
        }

    } catch (error) {
        res.status(500).json(error.message)
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
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            })
        }
        
        const findUser = await userModel.findOne({email: email.toLowerCase()});
        
        if(!findUser) {
            return res.status(404).json({
                message: "The user with this email does not exist."
            });
        }
        // console.log('findUser:', findUser);
        
        const matchPassword = await bcrypt.compare(password, findUser.password);
        
        if (!matchPassword) {
            return res.status(400).json({
                message: 'Invalid password.'
            });
        }

        if(!findUser.isActive) {
            return res.status(400).json({
                error: "The user with this email is not verified."
            })
        }

        // if (findUser.isVerified === false) {
        //     return res.status(400).json({
        //         message: "The user with this email is not verified."
        //     })
        // }

        findUser.isLoggedIn = true;
        
        const user = jwt.sign({
            nameOfCompany: findUser.nameOfCompany,
            email: findUser.email,
            userId: findUser._id,
            isAdmin: findUser.isAdmin
        }, process.env.jwtSecret, {expiresIn: "1hr"});

        const {isActive, createdAt, updatedAt, __v, ...others} = findUser._doc;

        return res.status(200).json({
            message: "Logged in successfully.",
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
        const { id, token } = req.params;
        // console.log(`Verifying email for userId: ${id}`);
        // console.log(`Received token: ${token}`);

        if(!id || !token) {
            return res.status(400).json({
                error: "User ID and token are required."
            })
        }

        jwt.verify(token, process.env.jwtSecret, async (err, decoded) => {
            if(err) {
                return res.status(400).json({
                    error: "Invalid or expired token."
                })
            }

            const user = await userModel.findById(id);
            if(!user) {
                // console.error(`User with ID ${id} not found.`);
                return res.status(404).json({
                    error: "User not found."
                })
            }

            // if (user.token !== token) {
            //     console.error(`Token mismatch for userId ${id}. Stored token: ${user.token}`);
            //     return res.status(400).json({
            //         error: "Token mismatch."
            //     })
            // }

            user.isActive = true;
            // user.token = undefined;
            await user.save();

            res.status(200).json({
                message: "Email verified successfully. You can now log in."
            })
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// exports.verifyEmail = async (req, res) => {
//     try {
//         const token = req.params.id;
//         const {userId} = token;
//         const findUser = await userModel.findById(userId);
//         console.log(findUser)

//         jwt.verify(token, process.env.jwtSecret, (err) => {
//             if(!err) {

//                 const link = `${req.protocol}://${req.get("host")}/api/v1/verify/${findUser._id}/${token}`;
//                 sendMail({
//                     subject: `Kindly verify your mail.`,
//                     email: findUser.email,
//                     html: welcomeEmail(link, findUser.nameOfCompany)
//                 });

//             } else {
//                 if(findUser.isVerified == true) {
//                     return res.status(400).json(`Your account has already been verified.`)
//                 };

//                 // userModel.findByIdAndUpdate(Id, {isVerified: true});
//                 findUser.isVerified = true
        
//                 res.status(200).json({
//                     message: `You have been verified, kindly go ahead and log in.`})
//             }
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     };
// };

// exports.verifyUser = async (req, res) => {
//     try {
//         const {token} = req.params;
//         const user = await userModel.findOne({
//             verificationToken: token
//         });

//         if (!user) {
//             return res.status(400).json({
//                 message: "Invalid or expired token."
//             });
//         }

//         user.isVerified = true;
//         user.verificationToken = undefined;
//         await user.save();

//         res.status(200).json({
//             message: "Email verified successfully."
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// };

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
            {id:user._id, email:user.email},
            process.env.jwtSecret,
            {expiresIn: "2 minutes"}
        );
        const reverifyLink = `${req.protocol}://${req.get("host")}/api/v1/reverify/${user._id}`;
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
