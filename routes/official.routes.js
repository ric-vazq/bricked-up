const express = require("express");
const OfficialSet = require("../models/OfficialSet.model");
const router = express.Router();


router.get("/official",(req,res,next) => {
    res.render('/views/official.hbs')

})

router.get("/official",(req,res,next) => {
    OfficialSet.find()
    .populate()
    .then()

})

module.exports = router;