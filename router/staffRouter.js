const router = require('express').Router();
const { newStaff, getAllStaff, getAStaff, updateAStaff,
    deleteAStaff, verifyStaff, loginStaff } = require('../controller/staffController');
const { authenticate, makeAdmin, authenticated } = require('../middleware/authorization');
const Joi = require("@hapi/joi");
const { validateStaff } = require('../middleware/staffValidation');
const { validatePassword } = require('../middleware/passwordValidation');
const {forgotPassword, changePassword, resetPassword} = require('../controller/password');
const { updateTasksCompleted, getPerformanceData } = require('../controller/performance');



router.post("/newStaff/:id", makeAdmin, newStaff);
router.post("/Staff", loginStaff);
router.post("/forget", authenticate, validatePassword, forgotPassword);


router.get("/verifyStaff/:id/:token", verifyStaff);
router.get("/allStaff", makeAdmin, getAllStaff);
router.get("/Staff/:id", makeAdmin, getAStaff);
router.get("/Staff/Performance/:id", authenticate, authenticated, validateStaff, getPerformanceData);

router.put("/reset", authenticate, validatePassword, resetPassword);
router.put("/change", authenticate, validatePassword, changePassword);
router.put("/Staff/:id", makeAdmin, updateAStaff);
router.put("/Staff/Task/:id", authenticate, authenticated, validateStaff, updateTasksCompleted);

router.delete("/Staff/:id", makeAdmin, deleteAStaff);

module.exports = router;