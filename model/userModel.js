const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String
    },
    nameOfCompany: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String,
        // unique: true,
        // lowercase: true,
        required: true,
        trim: true
    },
    password: {
        type: String
    },
    staff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "staff"
    }],
    // profilePicture: {
    //     pictureId: String,
    //     pictureUrl: String
    // },
    // isVerified: {
    //     type: Boolean,
    //     default: false
    // },
    isActive: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type:Boolean,
        default: true
    }
    // isSuperAdmin: {
    //     type:Boolean,
    //     default:false
    // } 
}, {timestamp: true});


const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

