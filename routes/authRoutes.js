// routes/auth-routes.js
const express    = require("express");
const router     = express.Router();
const passport   = require('passport');
const nodemailer = require('nodemailer');

// User model
const User = require("../models/User");

const bcrypt = require("bcryptjs");

const bcryptSalt = 10;



router.get("/signup", (req, res, next) => {
    res.render("userViews/signup");
  });
  


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  
    if (username === "" || password === "") {
      req.flash('error', 'please specify a username and password to sign up')
      res.render("userViews/signup", { message: req.flash("error") });
      return;
    }
  
    User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("userViews/signup", { message: req.flash("error") });
        return;
      }
  
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
  
      User.create({
          username: username,
          password: hashPass
      })
      .then((response)=>{
        let email = req.body.email;
        let message = "You're Awesome, keep it up"

        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'thisguyistheanswer@gmail.com',
            pass: 'imawesome2k' 
          }
        });
        transporter.sendMail({
          from: '"Casper the Game Ghost  👻" <casper@movieproject.com>',
          to: email, 
          subject: "Whose Awesome?", 
          text: message,
          html: `<b>${message}</b>`
        })
    })
    .catch(error => {
      next(error)
    })
  })
});

  router.get('/login', (req, res, next)=>{
      res.render('userViews/login', {message: req.flash('error')})
  });

  router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }
    User.findOne({ "username": username }, (err, user) => {
        if (err || !user) {
          res.render("auth/login", {
            errorMessage: "The username doesn't exist"
          });
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
    });
  });

  router.get("/auth/google", passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/plus.profile.emails.read"]
  }));
  
  router.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/"
  }));

  //logout
  router.get('/logout', (req, res, next)=>{
    req.logout()
  res.redirect('/login')
});

module.exports = router;