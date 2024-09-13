const router = require('express').Router();
const { createStaff, getAllStaff, getAStaff, updateAStaff,
    deleteAStaff, verifyStaff, loginStaff, 
    newStaff} = require('../controller/staffController');
const { createUser, logIn, getAllUsers, getAUser,
    deleteAUser, verifyEmail, reverifyEmail, updateAUser } = require('../controller/userController');
// const { authenticate } = require('../middleware/authentication');
// const { checkAdmin } = require('../middleware/authorization');
const { authenticate, makeAdmin, authenticated } = require('../middleware/authorization');
const Joi = require("@hapi/joi");
// const uploader = require('../utils/multer');
const { validateSignUp } = require('../middleware/userValidation');
const { validateStaff } = require('../middleware/staffValidation');
const { validatePassword } = require('../middleware/passwordValidation');
const {forgotPassword, changePassword, resetPassword} = require('../controller/password');
const { updateTasksCompleted, getPerformanceData } = require('../controller/performance');




router.post("/newUser", validateSignUp, createUser);
router.post("/newStaff/:id", makeAdmin, newStaff);
router.post("/Login", logIn);
router.post("/Staff", loginStaff);
router.post("/forget", makeAdmin, forgotPassword);

router.get("/verify/:id/:token", verifyEmail);
router.get("/reverify/:id", reverifyEmail);
router.get("/verifyStaff/:id/:token", verifyStaff);
router.get("/allUsers", makeAdmin, getAllUsers);
router.get("/allStaff", makeAdmin, getAllStaff);
router.get("/User/:id", makeAdmin, getAUser);
router.get("/Staff/:id", makeAdmin, getAStaff);
router.get("/Staff/Performance/:id", authenticate, authenticated, validateStaff, getPerformanceData);

router.put("/reset", makeAdmin, resetPassword);
router.put("/change", validatePassword, changePassword);
router.put("/Staff/:id", makeAdmin, updateAStaff);
router.put("/Staff/Task/:id", authenticate, authenticated, validateStaff, updateTasksCompleted);
router.patch("/Update/:id", makeAdmin, updateAUser);

router.delete("/User/:id", makeAdmin, deleteAUser);
router.delete("/Staff/:id", makeAdmin, deleteAStaff);

module.exports = router;