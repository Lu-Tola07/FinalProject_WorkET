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
    confirmPassword: {
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

userSchema.pre("save", function(next) {
    this.fullName = capitalizeEachWord(this.fullName);

    next()
});

function capitalizeEachWord(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

