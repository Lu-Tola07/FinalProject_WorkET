const staffModel = require('./models/Staff'); // Adjust the path as needed

// Function to update the number of tasks completed
exports.updateTasksCompleted = async (req, res) => {
    try {
        const { staffId, tasksCompleted } = req.body;

        if (!staffId || tasksCompleted == null) {
            return res.status(400).json({ message: "Staff ID and tasks completed are required." });
        }

        const staff = await staffModel.findById(staffId);
        if (!staff) {
            return res.status(404).json({ message: "Staff not found." });
        }

        staff.performance.tasksCompleted = tasksCompleted;
        await staff.save();

        res.status(200).json({ message: "Tasks completed updated successfully.", data: staff });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to add a performance review
exports.addPerformanceReview = async (req, res) => {
    try {
        const { staffId, reviewerId, rating, comments } = req.body;

        if (!staffId || !reviewerId || rating == null) {
            return res.status(400).json({ message: "Staff ID, reviewer ID, and rating are required." });
        }

        const staff = await staffModel.findById(staffId);
        if (!staff) {
            return res.status(404).json({ message: "Staff not found." });
        }

        const review = {
            reviewer: reviewerId,
            rating,
            comments
        };

        staff.performance.performanceReviews.push(review);

        // Calculate average rating
        const totalRatings = staff.performance.performanceReviews.reduce((acc, review) => acc + review.rating, 0);
        staff.performance.averageRating = totalRatings / staff.performance.performanceReviews.length;

        await staff.save();

        res.status(200).json({ message: "Performance review added successfully.", data: staff });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to get performance data
exports.getPerformanceData = async (req, res) => {
    try {
        const { staffId } = req.params;

        if (!staffId) {
            return res.status(400).json({ message: "Staff ID is required." });
        }

        const staff = await staffModel.findById(staffId);
        if (!staff) {
            return res.status(404).json({ message: "Staff not found." });
        }

        res.status(200).json({ data: staff.performance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
