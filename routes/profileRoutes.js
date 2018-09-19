// routes/profileRoute.js
const express     = require("express");
const router      = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const ensureLogin = require("connect-ensure-login");
const User        = require("../models/User");
const multer      = require("multer")

router.get("/profile", (req, res, next) => {
  User.findById(req.session.currentUser._id)
  .then((profile) => {
    res.render('userViews/profile', {profile:  profile})
    })
  .catch((err)=>{
    next(err);
  });
});

router.post('/profile/update/:id', uploadCloud.single('photo'), (req, res, next) => {
  const theupdate = {
    username: req.body.username,
    aboutme: req.body.aboutme,
    avatar: req.body.avatar,
  }
  // if(req.file) {
  //   theupdate.avatar = req.file.avatar
  // }
  User.findByIdAndUpdate(req.params.id, theupdate)
    .then((response)=>{
      res.redirect(`/profile/${response._id}`);

    })
    .catch((err)=>{
      next(err)
    })
  
  
});

router.get('/profile/edit/:id', (req, res, next) => {
  User.findById(req.params.id)
.then((aUser) => {
  // Games.find()
  // .then((gameInfo) => {
    res.render('userViews/edit', {theUser: aUser});
  })
  // .catch((err) => {
  //   next(err);
  // })
  .catch((err) => {
    next(err)
  });
})
// });


module.exports = router;