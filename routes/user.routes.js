const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model")
const Set = require("../models/Set.model")
const Part = require("../models/Part.model")

router.get("/profile", isLoggedIn, (req, res, next) => {
    res.render("user/profile", {userInSession : req.session.currentUser })
})
router.get("/edit-profile", isLoggedIn, (req, res, next) => {
    
})

module.exports = router;