function welcomeEmail(verifyLink, nameOfCompany) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Welcome to WorkET</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #2c2c2c; /* Dark background */
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 20px auto; /* Add some top margin */
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                background-color: #f4f4f4; /* Light grey background */
            }
            .header {
                background: #333333;
                padding: 10px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color: #ffffff;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .footer {
                background: #333333;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
                font-size: 0.9em;
                color: #cccccc;
            }
            .button {
                display: inline-block;
                background-color: #000000;
                color: #ffffff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to WorkET!</h1>
            </div>
            <div class="content">
                <p>Hello ${nameOfCompany}</p>
                <p>Thank you for signing up. We are excited to have you on board.</p>
                <p>Please click the button below to verify your account:</p>
                <p>
                    <a href="${verifyLink}" class="button">Verify My Account</a>
                </p>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Regards,<br>WorkET Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()}. All rights reserved.</p>
                <p>WorkET</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {welcomeEmail};

// function welcomeEmail(verifyLink, nameOfCompany) {
//     return `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Document</title>
//             {/* <link rel="stylesheet" href="stlye.css"> */}
//             <style>
//                 *{
//                     margin: 0%;
//                     padding: 0%;
//                     box-sizing: border-box;
//                 }
//                 .Container{
//                     width: 100%;
//                     height: 100vh;
//                     justify-content: center;
//                     align-items: center;
//                     display: flex;
//                     background-color: blue;
//                 }
//                 .wrapper{
//                     width: 720px;
//                     height: 518px;
//                     background-color: rgba(250, 250, 250, 1);
//                     border-radius: 20px;
//                     display: flex;
//                     flex-direction: column;
//                     align-items: center;
//                     justify-content:space-between
//                 }
//                 .logo{
//                     width: 720px;
//                     height: 95px;
//                     background-color: black; 
//                     border-radius: 20px;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                 }
//                 .Emailbutton{
//                     width: 188px;
//                     height:47px ;
//                     background-color:#093C7E ;
//                     padding:
//                     10px, 30px, 10px, 30px ;
//                     gap: 10px;
//                     border-radius:10px;
//                     margin-bottom: 40px;
//                     color: rgba(250, 250, 250, 1);
//                     font-weight: 500;
//                     cursor: pointer;
//                     box-shadow:none;
//                 }
//             <style/>
//         </head>
//         <body>
//             <div class='Container'>
//                 <div class='wrapper'>
//                     <div class='logo'>
//                         <img src="assets/WorkET.png" alt="" />
//                     </div>
//                     <h3>To complete email verification,<br/>please press the button below.</h3>
//                     <img src="assets/check-mail 1.png" alt="" />
//                     <button class='Emailbutton'><h4>Confirm Email</h4></button>
//                 </div>
//             </div>    
//         </body>
//         </html>
//     `
// };

// module.exports = {welcomeEmail};