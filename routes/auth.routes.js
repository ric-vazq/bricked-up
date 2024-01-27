const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const transporter  = require("../config/transporter");
const { token } = require("morgan");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, async (req, res, next) => {
  try {
    const { username, email, password, passwordVerification } = req.body;
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    const foundUsername = await User.findOne({ username });
    const foundEmail = await User.findOne({ email })
    if (foundUsername) {
      return res.render("auth/signup", {errorMessage: "Username taken"});
    } else if (foundEmail) {
      return res.render("auth/signup", {errorMessage: "Email already in use"});
    } else if (username === "" || email === "" || password === "" || passwordVerification === "") {
      res.status(400).render("auth/signup", {
        errorMessage:
          "All fields are mandatory. Please provide your username, email and password."});
      return;
    } else if (password.length < 6) {
      res.status(400).render("auth/signup", {
        errorMessage: "Your password needs to be at least 6 characters long."});
      return;
    } else if (!regex.test(password)) {
      res
        .status(400)
        .render("auth/signup", {
          errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."});
      return;
    } else if (password !== passwordVerification){
      res.status(400).render("auth/signup", {
        errorMessage: "The passwords weren't the same. Please verify that both are typed in identically."
      })
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({ username, email, password: hashedPassword, confirmationCode: token})
      const confirmMail = await transporter.sendMail({
        from: 'Bricked Up',
        to: user.email,
        subject: 'Confirm your account by Bricked Up',
        text: `Welcome ${user.username}, please verify your email by clicking the link below.`,
        html: `
        <html>
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        </head>
        <body>
        <div class="container text-center">
        <h2>Click the link to activate your account</h2> 
        <a href="https://bricked-up.onrender.com/auth/confirm/${user.confirmationCode}">Verify Account</a>
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        </html>
        `
      })
      console.log(confirmMail);
      return res.redirect("/auth/login")
    }
  } catch (error) {
    next(error)
  }
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, async (req, res, next) => {
  const { username, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username and password.",
    });

    return;
  }

  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // let user = await User.findOne({ username })
  // if (!user) {
  //   res
  //   .status(400)
  //   .render("auth/login", { errorMessage: "Wrong credentials"})
  // }

  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }
      // If the user hasn't activated their account then error message
      if (user.status === 'Pending Confirmation') {
        res
          .status(400)
          .render("auth/login", {errorMessage: "Account hasn't been activated."})
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/user/profile");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

router.get("/confirm/:confirmationCode", isLoggedOut, async (req, res, next) => {
  const { confirmationCode } = req.params; 
  const update = { status: 'Active'}
  try {
    let user = await User.findOneAndUpdate({ confirmationCode: confirmationCode }, update)
    if (!user) {
      res.redirect("/auth/signup")
      return; 
    }

    return res.redirect("/auth/login")
  } catch (error) {
    next(error)
  }
})

module.exports = router;
