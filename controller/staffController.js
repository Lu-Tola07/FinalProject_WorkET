require('dotenv').config();
const mongoose = require('mongoose');
const staffModel = require('../model/staffModel');
const userModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const sendMail = require('../helpers/email');
const crypto = require('crypto');
// const multer = require('../utils/multer');
// const cloudinary = require('../utils/cloudinary');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const {createUser} = require('./userController');

// const generateUniqueCode = () => {
//     return Math.floor(10000 + Math.random() * 90000).toString()
// };

// const generateUniqueCode = () => {
//     return crypto.randomBytes(6).toString('hex').toUpperCase(); // 12-character code
// };

// const generateAndSaveUniqueCode = async () => {
//     let code;
//     let unique = false;

//     while(!unique) {
//         code = generateUniqueCode();

//         const existingCode = await userModel.findOne({verificationCode: code});

//         if(!existingCode) {
//             unique = true
//         }
//     }

//     return code
// };


exports.newStaff = async (req, res) => {
    try {
        const { fullName, gender, email, role, address,
            phoneNumber, bank, accountName, accountNumber,
            monthlyGross} = req.body;
        const id = req.params.id;

        if(!id) {
            return res.status(400).json({
                message: "No ID provided in request body."
            })
        }

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user ID format."
            })
        }
        // console.log(`Searching for user with ID: ${id}`);

        const user = await userModel.findById(id);
        if(!user) {
            return res.status(404).json({
                message: "This user was not found."
            })
        }

        // const file = req.file;
        // if (!file) {
        //     return res.status(400).json({ message: "Kindly upload your profile picture." });
        // }

        const randomPassword = crypto.randomBytes(8).toString('hex');
        console.log(randomPassword)
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        // const uniqueCode = generateUniqueCode();

        const data = {
            fullName: fullName.trim(),
            gender,
            email,
            password: hashedPassword,
            role,
            address: address.trim(),
            phoneNumber,
            bank,
            accountName: accountName.trim(),
            accountNumber,
            monthlyGross: monthlyGross.trim(),
            user: id
            // loginCode: uniqueCode
        };

        const newStaff = await staffModel.create(data);
        user.staff.push(newStaff._id);
        await user.save();

        // const emailContent = `Hello ${newStaff.fullName},\n\nYour account has been created successfully.\n\nLogin Email: ${newStaff.email}\nPassword: ${randomPassword}\nLogin Code: ${uniqueCode}\n\nPlease change your password after logging in.\n\nBest regards,\nYour Company`;

        // try {
        //     await sendMail(newStaff.email, 'Your Account Has Been Created', emailContent);

        const emailContent = `Hello ${newStaff.fullName},\n\n
        Your account has been successfully created.\n\n
        Login Email: ${newStaff.email}\nPassword: ${randomPassword}\n\n
        Please ensure to change your password after logging in.\n\nBest regards,\nThe WorkET Team`;

        try {
            
            await sendMail({
                email: newStaff.email,
                subject: `Welcome to ${user.nameOfCompany}!, Your Account Has Been Created.`,
                text: emailContent,    
                html: emailContent    
            })

        } catch (emailError) {
            console.error("Error sending email:", emailError.message)
            return res.status(500).json({
                message: "Failed to send email."
            })
        }

        res.status(200).json({
            message: `The staff, ${newStaff.fullName} has been created.`,
            data: newStaff
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// exports.createStaff = async (req, res) => {
//     try {
//         const {fullName, email, role, address, phoneNumber} = req.body;

//         const id = req.params.id;
//         if (!id) {
//             return res.status(400).json({
//                 message: "No ID provided in request body."
//             });
//         }
//         // console.log('Searching for user with ID:', id);
        
//         const user = await userModel.findById(id);
//         if (!user) {
//             return res.status(404).json({
//                 message: "This user was not found."
//             })
//         }

//         // if(!req.file) {
//         //     return res.status(400).json("Kindly upload your profile picture.")
//         // };

//         // const cloudProfile = await cloudinary.uploader.upload(req.file.path, {folder: "Staff Dp"}, (err) => {
//         //     if(err) {
//         //         return res.status(400).json(err.message)
//         //     }
//         // });

//         const data = {
//             fullName,
//             email,
//             role,
//             address,
//             phoneNumber,
//             user: id
//         };

//         const newStaff = await staffModel.create(data);

//         // await fs.unlink(req.file.path, (err) => {
//         //     if(err) {
//         //         return res.status(400).json("Unable to delete staff file.")
//         //         console.log(err.message)
//         //     } else {
//         //         console.log(`File has been deleted successfully.`)
//         //     }
//         // });

//         user.staff.push(newStaff._id);
//         await user.save();

//         res.status(200).json({
//             message: `The staff, ${newStaff.fullName} has been created.`,
//             data: newStaff
//         })

//     } catch (error) {
//         res.status(500).json(error.message)
//     }
// };

exports.verifyStaff = async (req, res) => {
    try {
        const Id = req.params.id;
        const findStaff = await staffModel.findById(Id);

        const code = await generateAndSaveUniqueCode();
        findStaff.loginCode = code;

        await code.save();

        jwt.verify(req.params.token, process.env.jwtSecret, (err) => {
            if(err) {

                const link = `${req.protocol}://${req.get("host")}/api/v1/verifyStaff/${verify._id}/${token}`;
                sendMail({
                    subject: `Kindly verify your mail.`,
                    email: findStaff.email,
                    html: welcomeEmail(link, findStaff.fullName),
                    text: `Your login code is ${code}.`
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
    }
};

exports.loginStaff = async (req, res) => {
    try {

        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            })
        }

        const staff = await staffModel.findOne({email: email.toLowerCase()});
        if(!staff) {
            return res.status(404).json({
                message: "Staff not found."
            })
        };
        // console.log(password)
        // console.log(staff.password)
       
        const isMatch = await bcrypt.compare(password, staff.password);
        // console.log(isMatch)

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password."
            })
        };

        const token = jwt.sign(
            {userId: staff._id, email: staff.email},
            process.env.jwtSecret,
            {expiresIn: '1h'}
        );

        res.status(200).json({
            message: "Login successful.", token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// exports.staffLogin = async (req, res) => {
//     try {
//         const {email, loginCode} = req.body;
        
//         const findUser = await userModel.findOne({companyEmail: email.toLowerCase()});

//         if (!findUser) {
//             return res.status(404).json({
//                 message: 'This email does not match with any existing company.'
//             });
//         };

//         const findStaff = await staffModel.findOne({staffEmail: email.toLowerCase()});
        
//         if (!findStaff) {
//             return res.status(404).json({
//                 message: 'The staff with this email does not exist.'
//             });
//         };

//         const matchLoginCode = await bcrypt.compare(loginCode, findStaff.loginCode);
        
//         if (!matchLoginCode) {
//             return res.status(400).json({
//                 message: 'Invalid login code.'
//             });
//         }

//         if (findStaff.isVerified === false) {
//             return res.status(400).json({
//                 message: 'The staff with this email is not verified.'
//             });
//         }

//         findStaff.isLoggedIn = true;
        
//         const staff = jwt.sign({
//             staffFullName: findStaff.fullName,
//             staffEmail: findStaff.email,
//             staffId: findStaff._id
//         }, process.env.jwtSecret, {expiresIn: "1d"});

//         const {isVerified, createdAt, updatedAt, __v, ...others} = findStaff._doc;

//         return res.status(200).json({
//             message: 'Logged in successfully.',
//             data: others,
//             token: staff
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// };

exports.getAllStaff = async (req, res) => {
    try {
        const id = req.params.userId; // Ensure the endpoint captures this parameter

        // Check if the user ID is provided
        if(!id) {
            return res.status(400).json({
                message: "User ID is required."
            })
        }

        // Find staff records for the specified user
        const staff = await staffModel.find({user: id}).sort({createdAt: -1}).populate("user");
        const allStaff = staff.length;

        // Check if any staff records were found
        if(allStaff < 1) {
            return res.status(404).json({
                message: "No staff was found."
            })
        }

        // Send response with the count of staff and data
        return res.status(200).json({
            message: "These are the number of staff available.",
            allStaff,
            data: staff
        });


        // const id = req.params.userId; // Choose based on your design

        // if(!id) {
        //     return res.status(400).json({
        //         message: "User ID is required."
        //     })
        // };

        // // Find staff records for the specified user
        // const staff = await staffModel.find({user: id}).sort({createdAt: -1}).populate("user");
        // const allStaff = staff.length;

        // if(allStaff < 1) {
        //     res.status(404).json({
        //         message: "No staff was found."
        //     })
        // } else {
        //     res.status(200).json({
        //         message: "These are the number of staff available.",
        //         allStaff,
        //         data: staff
        //     })
        // }

        // const staff = await staffModel.find({user: }).sort({createdAt: -1}).populate("user");
        // const allStaff = staff.length;

        // if(allStaff < 1) {
        //     res.status(404).json("No staff was found.")
        // } else {
        //     res.status(200).json({
        //         message: "These are the number of staff available.",
        //         allStaff,
        //         data: staff
        //     })
        // }

    } catch (error) {
        res.status(500).json(error.message)
    }
};

exports.getAStaff = async (req, res) => {
    try {
        
        const oneStaff = await staffModel.findById(req.params.id).populate("user");
        const totalStaff = oneStaff.user.length;
        res.status(200).json({
            message: `The staff with the ID: ${oneStaff.id} has been found.`,
            totalStaff,
            data: oneStaff 
        })
        // console.log(oneContent.user.length);

    } catch (error) {
        res.status(500).json(error.message)
    }
};

exports.updateAStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        const {fullName, email, role, address, phoneNumber} = req.body;
        const data = {
            fullName,
            email,
            role,
            address,
            phoneNumber,
            user
        }

        const updatedStaff = await staffModel.findOneAndUpdate(
            {_id: staffId},
            data,
            {new: true}
        );
        
        if(updatedStaff) {
            return res.status(200).json({
                message: "This staff has been updated.",
                data: updatedStaff
            })
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
};

exports.deleteAStaff = async (req, res) => {
    try {
        
        const id = req.params.id;
        const deleteStaff = await staffModel.findByIdAndDelete(id);

        if(!deleteStaff) {
            res.status(404).json({
                message: `The staff with Id: ${id} was not found.`
            })
        } else {
            res.status(201).json({
                messsage: "This staff has successfully been deleted."
            })
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
};

exports.updatePicture = async (req, res) => {
    try {
        const staffToken = req.headers.authorization.split(" ").pop();
  
        if(!req.file || !req.file.path) {
            return res.status(400).json({
                error: "Picture has not been provided."
            })
        };
      
        const verifyToken = promisify(jwt.verify);
      
      let newStaff;
      try {
        newStaff = await verifyToken(staffToken, process.env.jwtSecret);
      } catch (err) {
        return res.status(400).json({
            error: err.message
        })
      };
  
      const staffId = newStaff.id;
      
      try {
        const cloudImage = await cloudinary.uploader.upload(req.file.path,{folder: "updatedDp"});
        const staff = await staffModel.findById(staffId);

        if(!staff) {
            return res.status(404).json({
                error: "Staff not found."
            })
        };
  
        if(staff.profilePicture && staff.profilePicture.pictureUrl) {
            if(!staff.previousProfilePictures) {
                staff.previousProfilePictures = []
            }
            staff.previousProfilePictures.push(staff.profilePicture.pictureUrl)
        };
  
        staff.profilePicture = {
          pictureId: cloudImage.public_id,
          pictureUrl: cloudImage.secure_url,
        };

        fs.unlink(req.file.path, (err) => {
          if(err) {
            console.log(err.message)
        } else {
            ("Delete has been successful.")
        }
    });
    
        const updatedStaff = await staff.save();

        const staffName = newStaff.fullName || "Staff";

        return res.status(200).json({
            message: `${staffName}'s profile picture has been updated.`,
            updatedStaff
        })
    
        } catch (uploadError) {
            return res.status(400).json({
                error: uploadError.message
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};




// Simulating a database with in-memory storage
// const users = {
//     'staff1': {
//         password: 'currentPassword123',
//         lastPasswordChange: new Date() // Timestamp of the last password change
//     }
// };

// Function to simulate checking password
// function isPasswordChanged(staffId, providedPassword, currentTimestamp) {
//     // Retrieve the user from the "database"
//     const user = users[staffId];
//     if (!user) {
//         throw new Error('User not found');
//     }

//     // Check if the provided password matches the stored password
//     if (providedPassword !== user.password) {
//         throw new Error('Incorrect password');
//     }

//     // Check if the password has been changed since the last login
//     return user.lastPasswordChange > new Date(currentTimestamp);
// }

// Example usage
// try {
//     const staffId = 'staff1';
//     const providedPassword = 'currentPassword123'; // Password provided by the user
//     const currentTimestamp = new Date().toISOString(); // Current time

//     const hasPasswordChanged = isPasswordChanged(staffId, providedPassword, currentTimestamp);
//     if (hasPasswordChanged) {
//         console.log('Password has been changed since last login.');
//     } else {
//         console.log('Password has not been changed.');
//     }
// } catch (error) {
//     console.error(error.message);
// }







