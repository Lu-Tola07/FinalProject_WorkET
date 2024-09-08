// require('dotenv').config();
// const nodeMailer = require('nodemailer');

// const sendMail = async (options) => {
//     const transporter = await nodeMailer.createTransport({
//         secure: true,
//         service: process.env.SERVICE,
//         auth: {
//             user: process.env.mailUser,
//             pass: process.env.mailPassword
//         }
//     });

// let mailOptions = {
//     from: process.env.mailUser,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     html: options.html
// }

// await transporter.sendMail(mailOptions);

// };

// module.exports = sendMail;

require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendMail(options) {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.mailUser, 
                pass: process.env.mailPassword,
            }
        })
            const mailOption = {
              from: process.env.mailUser,
              to: options.email,
              subject: options.subject,
              text: options.text,
              html: options.html,
              attachments: options.attachments // Attachments array
            };
        
            await transporter.sendMail(mailOption);   
            return {
                success: true,
                message: 'Email sent successfully',
            }
    } catch (err) {
        console.error('Error sending mail:', err.message);
        return {
            success: false,
            message: 'Error sending mail: ' + err.message,
        };
    }
}

module.exports = sendMail;