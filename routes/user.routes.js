const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model")
const Set = require("../models/Set.model")
const Part = require("../models/Part.model")

router.get("/profile", isLoggedIn, (req, res, next) => {
    console.log(req.session.currentUser);
    User.findById(req.session.currentUser._id).populate('favoriteBuilds')
    .then(foundUser => {
        let sets = foundUser.favoriteBuilds; 
        return res.render("user/profile", { userInSession: req.session.currentUser, mySets: sets })
    })
    .catch(err => next(err));
    
})
router.get("/edit-profile", isLoggedIn, (req, res, next) => {

})

module.exports = router;