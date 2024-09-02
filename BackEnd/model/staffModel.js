const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    fullName: {
        type: String
    },
    email: {
        type: String,
        // unique: true,
        // lowercase: true,
        required: true,
        trim: true
    },
    // passWord: {
    //     type: String
    // },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    // isVerified: {
    //     type:Boolean,
    //     default:false
    // },
    profilePicture: {
        pictureUrl: String,
        pictureId: String
    } 
}, {timestamp: true});


const staffModel = mongoose.model("staff", staffSchema);

module.exports = staffModel;

