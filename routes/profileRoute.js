// routes/profileRoute.js
const express    = require("express");
const router     = express.Router();
const User = require("../models/User");

router.get("/profile", (req, res, next) => {
  console.log('-=-=-=-=-=-=-', )
  User.find(req.session.currentUser)
  .then((profile) => {
    res.render('userViews/profile', {user: profile})
    console.log('>,>.>.....>>', User)
    })
  .catch((err)=>{
    next(err);
  });
});


module.exports = router;