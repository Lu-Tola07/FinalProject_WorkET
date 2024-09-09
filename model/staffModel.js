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
    password: {
        type: String
    },
    role: {
        type: String
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    loginCode: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    isVerified: {
        type:Boolean,
        default:false
    },
    isPasswordChanged: {
        type: Boolean,
        default: false
        // required: true
    },
    profilePicture: {
        pictureId: String,
        pictureUrl: String
    },
    performance: {
        tasksCompleted: {
            type: Number,
            default: 0
        },
        performanceReviews: [
            {
                reviewDate: {
                    type: Date,
                    default: Date.now
                },
                reviewer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user"
                },
                rating: {
                    type: Number,
                    min: 1,
                    max: 5
                },
                comments: {
                    type: String
                }
            }
        ],
        averageRating: {
            type: Number,
            default: 0
        }
    } 
}, {timestamp: true});


const staffModel = mongoose.model("staff", staffSchema);

module.exports = staffModel;

