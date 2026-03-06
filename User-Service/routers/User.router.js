const express = require('express');
const { userprofile } = require('../Controllers/user.controller');
const { requireAuth } = require('../utils/auth');


const router = express.Router();



router.get("/getUser-profile" , requireAuth ,  userprofile);



module.exports = router;