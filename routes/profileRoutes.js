// routes/profileRoute.js
const express     = require("express");
const router      = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const ensureLogin = require("connect-ensure-login");
const multer      = require("multer");
const User        = require("../models/User");
const Game        = require("../models/Game");

router.get("/profile", (req, res, next) => {
  var editable;
  console.log("================================ ", req.user);
  User.findById(req.user._id)
  .then((profile) => {
    console.log("the profile info &&&&&&&&&&&&&&&&&& ", profile);
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

router.post('/profile/update/:id', (req, res, next) => {
  const theupdate = {
    username: req.body.username,
    aboutme: req.body.aboutme,
    avatar: req.body.avatar,
  }
  User.findOneAndUpdate(req.params.id, theupdate)
    .then((response)=>{
      console.log('=-=-=-=-=-=-', response)
      res.redirect(`/profile`);

    })
    .catch((err)=>{
      next(err)
    })
  
  
});

router.get('/profile/edit/:id', (req, res, next) => {
  User.findById(req.params.id)
.then((aUser) => {
    res.render('userViews/edit', {theUser: aUser});
  })
  .catch((err) => {
    next(err)
  });
})

module.exports = router;