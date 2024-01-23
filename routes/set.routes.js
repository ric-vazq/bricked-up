const express = require("express");
const router = express.Router();
const User = require("../models/User.model")
const Set = require("../models/Set.model");
const Part = require("../models/Part.model");
const OfficialSet = require("../models/OfficialSet.model")
const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploader = require('../config/cloudinary');
const isCreator = require("../middleware/isCreator");

router.get("/create", isLoggedIn, (req, res, next) => {
    Part.find()
    .then(parts => {
        return res.render("set/create", { userInSession: req.session.currentUser, parts: parts })
    })
    .catch(err => next(err));
})

router.post("/create", fileUploader.single('set-image'), isLoggedIn, (req, res, next) => {
    const { name, parts, creators, instructions } = req.body;
    Set.create({ name, parts, creators, instructions, imgUrl: req.file.path })
    .then(newSet => {
        console.log("New Set:", creators);
        return User.findById( creators );
    })
    .then(x => {
        return res.redirect("/user/profile")
    })
    .catch(err => next(err))
})

router.get("/fanmade", (req, res, next) => {
    Set.find().populate('creators')
    .then(setDisplay => {
        console.log(setDisplay)
        res.render("set/fanmade",{setDisplay:setDisplay,userInSession:req.session.currentUser})
    })
    
})

router.get("/official", (req, res, next) => {
    OfficialSet.find()
    .then(foundSets => {
        res.render("set/official", { foundSets: foundSets, userInSession: req.session.currentUser })
    })
})

router.get("/info/:id", (req, res, next) => {
    const { id } = req.params; 
    Set.findById(id)
        .populate('parts')
        .then(setInfo => {
            return res.render("set/info", {userInSession: req.session.currentUser, set: setInfo})
        })
        .catch(err => next(err));
})

router.get("/info/:id/edit", isCreator, (req, res, next) => {
    const { id } = req.params; 
    let setFound;
    Set.findById(id)
    .then(set => {
        setFound = set; 
        return Part.find();
    })
    .then(allParts => {
        return res.render("set/edit", {set: setFound, parts: allParts, userInSession: req.session.currentUser})
    })
})

router.post("/info/:id/edit", fileUploader.single('set-image'), (req, res, next) => {
    const { id } = req.params;
    const { name, parts, existingImage, instructions } = req.body; 

    let imgUrl;
    if (req.file) {
        imgUrl = req.file.path;
    } else {
        imgUrl = existingImage;
    }

    Set.findByIdAndUpdate(id, { name, parts, imgUrl, instructions }, { new: true })
    .then(x => res.redirect(`/user/profile`))
    .catch(err => next(err));
})

router.post("/info/:id/delete", isCreator, (req, res, next) => {
    const { id } = req.params; 
    Set.findByIdAndDelete(id)
    .then(() => res.redirect("/user/profile"))
    .catch(err => next(err));
})

module.exports = router;