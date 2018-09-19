const express           = require("express");
const router            = express.Router();
const uploadCloud       = require('../config/cloudinary.js');
const Game              = require("../models/Game");

router.get("/game", (req, res, next) =>{
Game.find()
.populate('creator')
.then((response) => {
  res.render('gameViews/game', {listOfGames: response})
})
.catch((err) => {
  next(err)
})
});

router.get('/game/new', (req, res, next) => {
  res.render('gameViews/create')
})

router.post('/game/create', (req, res, next) => {
const userId = req.session.currentUser._id
   Game.create({
    creator: userId,
    name: req.body.name,
    description: req.body.description,
    liveURL: req.body.liveURL,
    // image: req.file.image,
  })
  .then((response) => {
    // User.findById(userId)
    req.session.currentUser.games.push(response._id)
    req.session.currentUser.save()
    console.log("-=-=-=-=-=-=-=-=-",req.session.currentUser.games)
    res.redirect('/game')  
  })
  .then((response) => {
  })
  .catch((err) => {
    next(err);
  })
});

router.post('/game/update/:id', uploadCloud.single('photo'), (req, res, next) => {
  const theupdate = {
    username: req.body.name,
    liveURL: req.body.liveURL,
    description: req.body.description,
  }
  Game.findByIdAndUpdate(req.params.id, theupdate)
    .then((response)=>{
      res.redirect(`/game/${response._id}`);
    })
    .catch((err)=>{
      next(err)
    }) 
});

router.get('/game/edit/:id', (req, res, next) => {
  User.findById(req.params.id)
.then((aGame) => {
    res.render('gameViews/edit', {theGame: aGame});
  })
  .catch((err) => {
    next(err)
  });
});

router.delete('/game/delete/:id', (req, res, next) =>{
  Game.findByIdAndRemove(req.params.id)
  .then ((response) =>{
    res.redirect('/game')
  })
  .catch ((err) =>{
    next(err)
  })
});

module.exports = router;