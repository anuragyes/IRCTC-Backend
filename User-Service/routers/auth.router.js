const express = require('express');
const { sendotp, verifyotp, LoginDetails, rotateRefreshToken } = require('../controllers/auth.controller');
const router = express.Router();




router.post('/send-otp', sendotp);
router.post("/enter-otp-verify", verifyotp);
router.post("/login", LoginDetails);
router.get("/refreshtoken", rotateRefreshToken)



module.exports = router;