const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const router = express.Router();
const User = require("../models/User.model")
const Set = require("../models/Set.model")
const Part = require("../models/Part.model");
const fileUploader = require('../config/cloudinary');

router.get("/profile", isLoggedIn, async (req, res, next) => {
    try {
    let user = await User.findById(req.session.currentUser._id)
    let allSets = await Set.find().populate('creators')
    let userSets = await allSets.filter(set => set.creators.username === user.username)
    return res.render("user/profile", { userInSession: user, mySets: userSets })
    } 
    catch(err) { 
    next(err)
    }  
})

router.get("/edit/:id", isLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params;
        let user = await User.findById(id)
        return res.render("user/edit-user", {userInSession: user})
    } 
    catch (error) {
        next(err)
    }
})

router.post("/edit/:id", fileUploader.single('profilePicture'), async (req, res, next) => {
    try {
    const { id } = req.params;
    console.log(req.body);
    const { existingImage } = req.body; 
    let profilePicture; 
    if (req.file) {
        profilePicture = req.file.path;
    } else {
        profilePicture = existingImage
    }
    let user = await User.findByIdAndUpdate(id, { profilePicture }, { new: true })
    console.log(user);
    return res.redirect("/user/profile")
    }
    catch (error) {
        next(error)
    }
})

router.post("/delete/:id", async (req, res, next) => {
    try {
        console.log("req.params", req.params);
        const { id } = req.params;
        let user = await User.findByIdAndDelete(id);
        let allSets = await Set.find().populate('creators')
        let userSets = await allSets.forEach( set => {
            if (set.creators.username === user.username) {
                Set.findByIdAndDelete(set._id)
            }
            return; 
        })
        let logout = await req.session.destroy(err => {
            if (err) {
                res.status(500).render("auth/logout", { errorMessage: err.message });
                return;
            }
        })
        return res.redirect("/")
    }
    catch (error) {
        next(error)
    }
})

module.exports = router;