// routes/profileRoute.js
const express     = require("express");
const router      = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const ensureLogin = require("connect-ensure-login");
const multer      = require("multer");
const User        = require("../models/User");
const Game        = require("../models/Game");

router.get("/profile", ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  var editable;
  User.findById(req.user._id)
  .then((profile) => {
    if(req.user.username === profile.username){
      editable = true;
      } else {
      editable = false;
      }    
    Game.find({_id: profile.games})
    .then((response) =>{
      data = {
        profile: profile,
        games: response,
        editable: editable
      }
      res.render('userViews/profile', data)
    })
    .catch((err) => {
      next(err);
    })
    })
  .catch((err)=>{
    next(err);
  });
});

router.get("/profile/:id", ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  // var editable;
  User.findById(req.params.id)
  .then((creatorProfile) => {
    // if(req.user.username === creatorProfile.username){
    //   editable = true;
    //   } else {
    //   editable = false;
    //   }    
    //  const id = creatorProfile.games.id
    console.log("the profile info of the user &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& ", creatorProfile)
    Game.find({ _id: creatorProfile.games})
    .then((response) =>{
      data = {
        creatorProfile: creatorProfile,
        games: response,
        // editable: editable
      }
      res.render('userViews/creatorprofile', data)
    })
    .catch((err) => {
      next(err);
    })
    })
  .catch((err)=>{
    next(err);
  });
});

router.post('/profile/update/:id', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  const theupdate = {
    username: req.body.username,
    aboutme: req.body.aboutme,
    avatar: req.body.avatar,
  }
  console.log("this is the update info ========================== ", theupdate);
  console.log("this is the id of the params  %%%%%%%%%%%%%%%%%%%%%%%%%%% ", req.params.id);
  User.findByIdAndUpdate(req.params.id, theupdate)
    .then((response)=>{
      console.log("this is the user info after the update ---------------------- ", response);
      res.redirect(`/profile`);

    })
    .catch((err)=>{
      next(err)
    })
  
  
});

router.get('/profile/edit/:id', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  User.findById(req.params.id)
.then((aUser) => {
    res.render('userViews/edit', {theUser: aUser});
  })
  .catch((err) => {
    next(err)
  });
})

module.exports = router;