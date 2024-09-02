const staffModel = require('../model/staffModel');
const userModel = require('../model/userModel');
const {createUser} = require('./userController');

exports.createStaff = async (req, res) => {
    try {
        const {fullName, email, address, phoneNumber} = req.body;

        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                message: "No ID provided in request body."
            });
        }
        // console.log('Searching for user with ID:', id);
        
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "This user was not found."
            })
        }

        const data = {
            fullName,
            email,
            address,
            phoneNumber,
            user: id
        };

        const newStaff = await staffModel.create(data);

        user.staff.push(newStaff._id);
        await user.save();

        res.status(200).json({
            message: `The staff, ${newStaff.fullName} has been created.`,
            data: newStaff
        })

    } catch (error) {
        res.status(500).json(error.message)
    }
};

exports.getAllStaff = async (req, res) => {
    try {
        
        const staff = await staffModel.find().sort({createdAt: -1}).populate("user");
        const allStaff = staff.length;

        if(allStaff < 1) {
            res.status(404).json("No staff was found.")
        } else {
            res.status(200).json({
                message: "These are the number of staff available.",
                allStaff,
                data: staff
            })
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
};

exports.getAStaff = async (req, res) => {
    try {
        
        const oneStaff = await staffModel.findById(req.params.id).populate("user");
        const totalStaff = oneStaff.user.length;
        res.status(200).json({
            message: `The staff with the ID: ${oneStaff.id} has been found.`,
            totalStaff,
            data: oneStaff 
        })
        // console.log(oneContent.user.length);

    } catch (error) {
        res.status(500).json(error.message)
    }
};

exports.updateAStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        const {fullName, email, address} = req.body;
        const data = {
            fullName,
            email,
            address,
            user
        }

        const updatedStaff = await staffModel.findOneAndUpdate(
            {_id: staffId},
            data,
            {new: true}
        );
        
        if(updatedStaff) {
            return res.status(200).json({
                message: "This staff has been updated.",
                data: updatedStaff
            })
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
};

exports.deleteAStaff = async (req, res) => {
    try {
        
        const id = req.params.id;
        const deleteStaff = await staffModel.findByIdAndDelete(id);

        if(!deleteStaff) {
            res.status(404).json({
                message: `The staff with Id: ${id} was not found.`
            })
        } else {
            res.status(201).json({
                messsage: "This staff has successfully been deleted."
            })
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
};

