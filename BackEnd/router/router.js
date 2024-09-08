const router = require('express').Router();
const { createStaff, getAllStaff, getAStaff, updateAStaff,
    deleteAStaff, verifyStaff, loginStaff, 
    newStaff} = require('../controller/staffController');
const { createUser, logIn, getAllUsers, getAUser,
    deleteAUser, verifyEmail, reverifyEmail, updateAUser } = require('../controller/userController');
// const { authenticate } = require('../middleware/authentication');
// const { checkAdmin } = require('../middleware/authorization');
const { authenticate, Admin } = require('../middleware/authorization');
const Joi = require("@hapi/joi");
const uploader = require('../utils/multer');
const { validateSignUp } = require('../middleware/userValidation');
const { validateStaff } = require('../middleware/staffValidation');
const {forgotPassword, changePassword, resetPassword} = require('../controller/password');



router.post("/newUser", uploader.single("profilePicture"), validateSignUp, createUser);
router.post("/newStaff/:id", Admin, validateStaff, newStaff);
router.post("/Login", logIn);
router.post("/Staff", loginStaff);
router.post("/forget", forgotPassword);

router.get("/verify/:id/:token", verifyEmail);
router.get("/reverify/:id", reverifyEmail);
router.get("/verifyStaff/:id/:token", verifyStaff);
router.get("/allUsers", getAllUsers);
router.get("/allStaff", getAllStaff);
router.get("/User/:id", getAUser);
router.get("/Staff/:id", getAStaff);

router.put("/reset", resetPassword);
router.put("/change", changePassword);
router.put("/Staff/:id", updateAStaff);
router.patch("/Update/:id", updateAUser);

router.delete("/User/:id", deleteAUser);
router.delete("/Staff/:id", deleteAStaff);

module.exports = router;