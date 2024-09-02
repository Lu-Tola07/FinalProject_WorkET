// const verifyUser = async (req, res) => {
//     try {
//         const { token } = req.params;
//         const { email } = jwt.verify(token, process.env.secret_key);

//         const user = await schoolModel.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         if (user.isVerified) {
//             return res.status(400).json({ message: 'User already verified' });
//         }

//         user.isVerified = true;
//         await user.save();

//         res.status(200).json({ message: "Verification successful", user });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };
// const resendVerification = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const checkUser = await schoolModel.findOne({ email });

//         if (!checkUser) {
//             return res.status(400).json({ message: 'User with this email is not registered' });
//         }

//         if (checkUser.isVerified) {
//             return res.status(400).json({ message: 'User is already verified' });
//         }

//         const token = jwt.sign({ email: checkUser.email, userId: checkUser._id }, process.env.secret_key, { expiresIn: "1d" });
//         const verificationLink = http://yourfrontenddomain.com/verify/${token};
//         const emailSubject = 'Resend Verification Mail';
//         const html = generateWelcomeEmail(checkUser.name, verificationLink, true);
//         const mailOptions = {
//             from: process.env.user,
//             to: email,
//             subject: emailSubject,
//             html: html
//         };

//         // Send the email
//         await sendEmail(mailOptions);

//         // Update the user's isVerified status
//         checkUser.isVerified = true;
//         await checkUser.save();

//         return res.status(200).json({ message: "Verification email sent" });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

const verifyUser = async (req, res) => {
    try {
        const { token } = req.params;
        const { email } = jwt.verify(token, process.env.secret_key);

        const user = await schoolModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Verification successful", user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const checkUser = await schoolModel.findOne({ email });

        if (!checkUser) {
            return res.status(400).json({ message: 'User with this email is not registered' });
        }

        if (checkUser.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        const token = jwt.sign({ email: checkUser.email, userId: checkUser._id }, process.env.secret_key, { expiresIn: "1d" });
        const verificationLink = http://yourfrontenddomain.com/verify/${token};
        const emailSubject = 'Resend Verification Mail';
        const html = generateWelcomeEmail(checkUser.name, verificationLink, true);
        const mailOptions = {
            from: process.env.user,
            to: email,
            subject: emailSubject,
            html: html
        };

        // Send the email
        await sendEmail(mailOptions);

        // Update the user's isVerified status
        checkUser.isVerified = true;
        await checkUser.save();

        return res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};