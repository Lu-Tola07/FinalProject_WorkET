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
const {forgotPassword, changePassword, resetPassword} = require('../controller/password');
const { updateTasksCompleted, getPerformanceData } = require('../controller/performance');




router.post("/newUser", validateSignUp, createUser);
router.post("/newStaff/:id", makeAdmin, validateStaff, newStaff);
router.post("/Login", logIn);
router.post("/Staff", loginStaff);
router.post("/forget", authenticate, forgotPassword);

router.get("/verify/:id/:token", verifyEmail);
router.get("/reverify/:id", reverifyEmail);
router.get("/verifyStaff/:id/:token", verifyStaff);
router.get("/allUsers", authenticate, getAllUsers);
router.get("/allStaff", makeAdmin, getAllStaff);
router.get("/User/:id", authenticate, getAUser);
router.get("/Staff/:id", authenticate, getAStaff);
router.get("/Staff/Performance/:id", authenticate, authenticated, getPerformanceData);

router.put("/reset", authenticate, resetPassword);
router.put("/change", authenticate, changePassword);
router.put("/Staff/:id", authenticate, updateAStaff);
router.put("/Staff/Task/:id", authenticate, authenticated, updateTasksCompleted);
router.patch("/Update/:id", authenticate, updateAUser);

router.delete("/User/:id", authenticate, deleteAUser);
router.delete("/Staff/:id", authenticate, deleteAStaff);

module.exports = router;