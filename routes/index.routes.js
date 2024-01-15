const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if (!req.session.currentUser){
    res.render("index");
  }
  else res.render("index", {userInSession:req.session.currentUser})
  
});

module.exports = router;
