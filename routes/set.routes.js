const express = require("express");
const router = express.Router();
const User = require("../models/User.model")
const Set = require("../models/Set.model");
const Part = require("../models/Part.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploader = require('../config/cloudinary');

router.get("/create", isLoggedIn, (req, res, next) => {
    Part.find()
    .then(parts => {
        return res.render("set/create", { userInSession: req.session.currentUser, parts: parts })
    })
    .catch(err => next(err));
})

router.post("/create", fileUploader.single('set-image'), (req, res, next) => {
    const { name, parts, creators, instructions } = req.body;
    Set.create({ name, parts, creators, instructions, imgUrl: req.file.path })
    .then(newSet => {
        console.log("New Set:", newSet);
        return User.findById( creators );
    })
    .then(x => {
        return res.redirect("/user/profile")
    })
    .catch(err => next(err))
})

router.get("/info/:id")

module.exports = router;