const multer = require('multer');
const path = require('path');


// const storage = multer.diskStorage({

//     destination: function(req, file, cb){
//         // console.log(file)
//         cb(null, "./media")
//     },
//     filename: function(req, file, cb){
//         const fileName = req.body.firstName;
//         const fileExtension = file.originalname.split(".").pop();
//         // console.log(fileExtension)
//         cb(null, `${fileName}.${fileExtension}`)


//         // const authHeader = req.headers.authorization;
//         //     let token;
    
//         //     if (authHeader) {
//         //         token = authHeader.split(' ')[1];
//         //     }     
//         // // console.log(user)
//         //     if(token){
//         //         // const token=req.headers
//         //         // console.log(token)
//         //         const decodedToken = jwt.verify(token,process.env.jwtSecret);
//         //         const user = decodedToken.firstName;
              
//         //         console.log(user)
//         //         const fileExtension = file.originalname.split('.').pop();
//         //         console.log('b')
//         //         cb(null, ${user}'s profile picture updated.${fileExtension}); 
//     },
//     // fileFilter: function(req, file, cb){
//     //     if(file.mimetype != "image/jpg" || file.mimetype != "image/jpeg" || file.mimetype != "image/png"){
//     //         return cb(new error())
//     //     }
//     //     if(file.size > 1024*1024){
//     //         return cb(new error())
//     //     } else {
//     //         cb(null, true)
//     //     }
//     // }

// });

// const uploader = multer({
//     storage,
//     fileFilter: function(req, file, cb){
//         const extension = path.extname(file.originalname)
//         if(extension == ".jpg" || extension == ".jpeg" || extension == ".png") {
//             cb(null, true)
//         } else {
//             cb(new Error("Unsupported format, kindly upload an image."))
//         }
//     },
    
//     limits: {fileSize: 1024*1024*20}
// });

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        // Set the destination folder for uploaded files
        cb(null, "./media");
    },
    filename: function(req, file, cb) {
        const fileName = req.body.fullName ? req.body.fullName.replace(/\s+/g, '_') : 'unknown';
        const fileExtension = file.originalname.split('.').pop();
        // Generate the filename with the correct format
        cb(null, `${fileName}.${fileExtension}`);
    }
});

// Multer uploader configuration with file filtering and size limit
const uploader = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        const extension = path.extname(file.originalname).toLowerCase();
        // Validate the file extension
        if(extension === ".jpg" || extension === ".jpeg" || extension === ".png") {
            cb(null, true);
        } else {
            cb(new Error("Unsupported format, kindly upload an image."));
        }
    },
    limits: { fileSize: 1024 * 1024 * 20 } // Limit file size to 20MB
});

module.exports = uploader;

// const multer = require('multer');
// const path = require('path');

// // Configure multer storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         console.log(file); // Optional: For debugging, to see file details
//         // Set the destination folder for uploaded files
//         cb(null, './media');
//     },
//     filename: function (req, file, cb) {
//         // Generate the filename with the correct format
//         const fileName = req.body.firstName ? req.body.firstName.replace(/\s+/g, '_') : 'unknown';
//         const fileExtension = path.extname(file.originalname).toLowerCase(); // Ensure the extension is lowercase
//         cb(null, `${fileName}${fileExtension}`);
//     }
// });

// // Multer uploader configuration with file filtering and size limit
// const uploader = multer({
//     storage: storage,
//     fileFilter: function (req, file, cb) {
//         const extension = path.extname(file.originalname).toLowerCase();
//         // Validate the file extension
//         if (extension === '.jpg' || extension === '.jpeg' || extension === '.png') {
//             cb(null, true);
//         } else {
//             cb(new Error('Unsupported format, kindly upload a JPEG, PNG, or JPG image.'));
//         }
//     },
//     limits: { fileSize: 1024 * 1024 * 20 } // Limit file size to 20MB
// });

// module.exports = uploader;
