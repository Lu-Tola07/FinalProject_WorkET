const router = require('express').Router();
const { createStaff, getAllStaff, getAStaff, updateAStaff, deleteAStaff } = require('../controller/staffController');
const { createUser, logIn, getAllUsers, getAUser, deleteAUser, verifyEmail } = require('../controller/userController');
const { authenticate } = require('../middleware/authentication');
const { authorize } = require('../middleware/authorization');
const Joi = require("@hapi/joi");
const { validateSignUp } = require('../middleware/validation');



router.post("/newUser", validateSignUp, createUser);
router.post("/newStaff/:id", authenticate, createStaff);
router.post("/Login", logIn);

router.get("/verify/:id/:token", verifyEmail);
router.get("/reverify");
router.get("/allUsers", getAllUsers);
router.get("/allStaff", getAllStaff);
router.get("/User/:id", getAUser);
router.get("/Staff/:id", getAStaff);

router.put("/Staff/:id", authenticate, updateAStaff);

router.delete("/User/:id", deleteAUser);
router.delete("/Staff/:id", deleteAStaff);

module.exports = router;