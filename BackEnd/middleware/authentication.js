require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
    try {
        
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

        if(!token) {
            return res.status(400).json("Incorrect token.")
        }

        await jwt.verify(token, process.env.jwtSecret, (err, data) => {
            if(err) {
                return res.status(400).json("Kindly login to perform this action.")
            }
            req.user = data._id
        });

        next();

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};