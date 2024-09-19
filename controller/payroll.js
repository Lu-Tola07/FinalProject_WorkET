const payrollModel = require('../model/payrollModel'); // Adjust the path as necessary

// /**
//  * Function to process and pay a staff member's salary.
//  * @param {string} staffId - The ID of the staff member.
//  * @param {Object} salaryDetails - An object containing salary details.
//  * @param {string} salaryDetails.title - The title of the staff member.
//  * @param {string} salaryDetails.name - The name of the staff member.
//  * @param {number} salaryDetails.basicSalary - The basic salary of the staff member.
//  * @param {number} salaryDetails.deduction - The deductions from the staff member's salary.
//  * @returns {Promise<Object>} - The updated payroll record.
//  */

exports.payStaff = async (req, res) => {
    try {
        const staffId = req.params._id;
        const { title, name, basicSalary, deduction } = req.body;

        // Ensure all required fields are present
        // if(!staffId || !title || !name || 
        //     basicSalary === undefined || deduction === undefined) {
        //     return res.status(400).send("Missing required parameters.")
        // };

        if (!staffId) {
            return res.status(400).send('Staff ID is required.');
        }
        if (!title) {
            return res.status(400).send('Title is required.');
        }
        if (!name) {
            return res.status(400).send('Name is required.');
        }
        if (basicSalary === undefined) {
            return res.status(400).send('Basic Salary is required.');
        }
        if (deduction === undefined) {
            return res.status(400).send('Deduction is required.');
        }        

        // Validate that the title is allowed
        const allowedTitles = ["Mr", "Miss", "Mrs"];
        if(!allowedTitles.includes(title)) {
            return res.status(400).send("Invalid title. Title can only be Mr, Miss, or Mrs.")
        };

        // Calculate net salary
        const basicSalaryParsed = parseFloat(basicSalary);
        const deductionParsed = parseFloat(deduction);
        const netSalary = basicSalaryParsed - deductionParsed;

        // Find or create the payroll record
        let payrollRecord = await payrollModel.findOne({ _id: staffId });

        if(!payrollRecord) {
            // Create a new payroll record if it doesn't exist
            payrollRecord = new payrollModel({
                title,
                name: name.trim(),
                basicSalary: basicSalaryParsed,
                deduction: deductionParsed,
                netSalary: netSalary
            })
        } else {
            // Update existing payroll record
            payrollRecord.title = title;
            payrollRecord.name = name.trim();
            payrollRecord.basicSalary = basicSalaryParsed;
            payrollRecord.deduction = deductionParsed;
            payrollRecord.netSalary = netSalary;
        }

        // Save the payroll record
        await payrollRecord.save();

        return res.status(200).json(payrollRecord);

    } catch (error) {
        console.error('Error processing salary:', error.message);
        return res.status(500).send("Internal Server Error.");
    }
};

exports.allStaffPay = async (req, res) => {
    try {
        const payrollRecords = await payrollModel.find();
        return res.status(200).json(payrollRecords);
    } catch (error) {
        console.error('Error fetching payroll records:', error.message);
        return res.status(500).send("Internal Server Error.");
    }
};



// exports.paySalary = async (req, res) => {
//     try {
//         const staffId = req.params._id;
//         // const salaryDetails = {
//         //     title,
//         //     name: name.trim(),
//         //     basicSalary,
//         //     deduction
//         // };

//         // // Ensure all required fields are present
//         // if (!staffId || !salaryDetails || !salaryDetails.title || !salaryDetails.name || 
//         //     salaryDetails.basicSalary === undefined || salaryDetails.deduction === undefined) {
//         //     throw new Error('Missing required parameters.');
//         // }

//         // // Validate that the title is allowed
//         // const allowedTitles = ["Mr", "Miss", "Mrs"];
//         // if (!allowedTitles.includes(salaryDetails.title)) {
//         //     throw new Error('Invalid title. Title can only be Mr, Miss, or Mrs.');
//         // }

//         // Calculate net salary
//         const basicSalary = parseFloat(salaryDetails.basicSalary);
//         const deduction = parseFloat(salaryDetails.deduction);
//         const netSalary = basicSalary - deduction;

//         // Find or create the payroll record
//         let payrollRecord = await payrollModel.findOne({ _id: staffId });

//         if (!payrollRecord) {
//             // Create a new payroll record if it doesn't exist
//             payrollRecord = new payrollModel({
//                 title: salaryDetails.title,
//                 name: salaryDetails.name,
//                 basicSalary: salaryDetails.basicSalary,
//                 deduction: salaryDetails.deduction,
//                 netSalary: netSalary
//             });
//         } else {
//             // Update existing payroll record
//             payrollRecord.title = salaryDetails.title;
//             payrollRecord.name = salaryDetails.name;
//             payrollRecord.basicSalary = salaryDetails.basicSalary;
//             payrollRecord.deduction = salaryDetails.deduction;
//             payrollRecord.netSalary = netSalary;
//         }

//         // Save the payroll record
//         await payrollRecord.save();

//         return payrollRecord;

//     } catch (error) {
//         console.error('Error processing salary:', error.message);
//         throw error; // Rethrow the error after logging it
//     }
// };

// paySalary(staffId, salaryDetails)
//     .then(updatedRecord => {
//         console.log('Payroll processed successfully:', updatedRecord);
//     })
//     .catch(error => {
//         console.error('Error:', error.message);
//     });

