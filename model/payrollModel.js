const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: {
            values: ["Mr", "Miss", "Mrs"],
            message: "Title can only either be Mr, Miss or Mrs."
        },
        required: true
    },
    name: {
        type: String
    },
    basicSalary: {
        type: Number
    },
    deduction: {
        type: Number
    },
    netSalary: {
        type: Number
    }
}, {timestamp: true});

const payrollModel = mongoose.model("payroll", payrollSchema);

module.exports = payrollModel;