const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const router = express.Router();
const User = require("../models/User.model")
const Set = require("../models/Set.model")
const Part = require("../models/Part.model")

router.get("/profile", isLoggedIn, (req, res, next) => {
    Set.find().populate('creators')
    .then(foundSets => {
        console.log(req.session.currentUser);
        const userSets = foundSets.filter(set => set.creators.username === req.session.currentUser.username)
        return res.render("user/profile", { userInSession: req.session.currentUser, mySets: userSets })
    })
    .catch(err => next(err));
    
})
router.get("/edit-profile/:id", isLoggedIn, (req, res, next) => {
    const { id } = req.params; 
    User.findById(id)
    .then(user => {
        return res.render("user/edit-user", {userInSession: user})
    })
    .catch(err => next(err));
})

router.post("/edit-profile/:id", (req, res, next) => {
    
})

module.exports = router;