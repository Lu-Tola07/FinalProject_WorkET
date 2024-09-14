const router = require('express').Router();
const { createUser, logIn, getAllUsers, getAUser,
    deleteAUser, verifyEmail, reverifyEmail, updateAUser } = require('../controller/userController');
// const { authenticate } = require('../middleware/authentication');
// const { checkAdmin } = require('../middleware/authorization');
const { authenticate, makeAdmin, authenticated } = require('../middleware/authorization');
const Joi = require("@hapi/joi");
// const uploader = require('../utils/multer');
const { validateSignUp } = require('../middleware/userValidation');
const { validatePassword } = require('../middleware/passwordValidation');
const {forgotPassword, changePassword, resetPassword} = require('../controller/password');



router.post("/newUser", validateSignUp, createUser);

router.post("/Login", logIn);
router.post("/forget", makeAdmin, forgotPassword);

router.get("/verify/:id/:token", verifyEmail);
router.get("/reverify/:id", reverifyEmail);
router.get("/allUsers", makeAdmin, getAllUsers);
router.get("/User/:id", makeAdmin, getAUser);

router.put("/reset", makeAdmin, resetPassword);
router.put("/change", authenticate, validatePassword, changePassword);
router.patch("/Update/:id", makeAdmin, updateAUser);

router.delete("/User/:id", makeAdmin, deleteAUser);

module.exports = router;