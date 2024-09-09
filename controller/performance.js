const staffModel = require('../model/staffModel');

exports.updateTasksCompleted = async (req, res) => {
    try {
        const { fullName, tasksCompleted } = req.body;

        if (!fullName || tasksCompleted == null) {
            return res.status(400).json({
                message: "Staff's full name and tasks completed are required."
            })
        }

        const staff = await staffModel.findById(fullName);
        if (!staff) {
            return res.status(404).json({
                message: "Staff not found."
            })
        }

        staff.performance.tasksCompleted = tasksCompleted;
        await staff.save();

        res.status(200).json({
            message: "Tasks completed updated successfully.",
            data: staff
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// exports.addPerformanceReview = async (req, res) => {
//     try {
//         const { staffId, reviewerId, rating, comments } = req.body;

//         if (!staffId || !reviewerId || rating == null) {
//             return res.status(400).json({ message: "Staff ID, reviewer ID, and rating are required." });
//         }

//         const staff = await staffModel.findById(staffId);
//         if (!staff) {
//             return res.status(404).json({ message: "Staff not found." });
//         }

//         const review = {
//             reviewer: reviewerId,
//             rating,
//             comments
//         };

//         staff.performance.performanceReviews.push(review);

//         // Calculate average rating
//         const totalRatings = staff.performance.performanceReviews.reduce((acc, review) => acc + review.rating, 0);
//         staff.performance.averageRating = totalRatings / staff.performance.performanceReviews.length;

//         await staff.save();

//         res.status(200).json({ message: "Performance review added successfully.", data: staff });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

exports.getPerformanceData = async (req, res) => {
    try {
        const id = req.params.id;

        if(!id) {
            return res.status(400).json({
                message: "Staff ID is required."
            })
        }

        const staff = await staffModel.findById(id);
        if (!staff) {
            return res.status(404).json({
                message: "Staff not found."
            })
        }

        res.status(200).json({
            data: staff.performance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};
