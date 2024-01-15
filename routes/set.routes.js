const express = require("express");
const router = express.Router();
const Set = require("../models/Set.model")
const Part = require("../models/Part.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/create", isLoggedIn, (req, res, next) => {
    Part.find()
    .then(parts => {
        return res.render("set/create", { userInSession: req.session.currentUser, parts: parts })
    })
    .catch(err => next(err));
})

module.exports = router;