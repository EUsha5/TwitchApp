const express           = require("express");
const router            = express.Router();
const uploadCloud       = require('../config/cloudinary.js');
const ensureLogin       = require("connect-ensure-login");
const Game              = require("../models/Game");
const User              = require("../models/User");


router.get("/game", ensureLogin.ensureLoggedIn('/login'), (req, res, next) =>{
 Game.find()
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

router.post('/game/create', ensureLogin.ensureLoggedIn('/login'), uploadCloud.single('photo'), (req, res, next) => {
const userId = req.user._id
   Game.create({
    creator: userId,
    name: req.body.name,
    description: req.body.description,
    liveURL: req.body.liveURL,
    image: req.file.url,
  })
  .then((response) => {
    User.findById(userId)
      .then((userData) => {
    userData.games.push(response._id)
    userData.save()
    res.redirect('/game')  
  })
  })
  .catch((err) => {
    next(err);
  })
});

// router.post('/game/update/:id', uploadCloud.single('photo'), (req, res, next) => {
//   const theupdate = {
//     name: req.body.name,
//     liveURL: req.body.liveURL,
//     description: req.body.description,
//   }
//   Game.findByIdAndUpdate(req.params.id, theupdate)
//     .then((response)=>{
//       res.redirect(`/game/${response._id}`);
//     })
//     .catch((err)=>{
//       next(err)
//     }) 
// });

// router.get('/game/edit/:id', (req, res, next) => {
//   Game.findById(req.params.id)
// .then((aGame) => {
//     res.render('gameViews/edit', {theGame: aGame});
//   })
//   .catch((err) => {
//     next(err)
//   });
// });

router.get('/game/delete/:id', ensureLogin.ensureLoggedIn('/login'), (req, res, next) =>{
  Game.findByIdAndRemove(req.params.id)
  .then ((response) =>{
    res.redirect('/game')
  })
  .catch ((err) =>{
    next(err)
  })
});

router.get('/game/:id', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  var deletable;
  Game.findById(req.params.id)
  .then((gameInfo)=>{
    User.findById(gameInfo.creator)
    .then((userFromDB) => {
      if(req.user._id.toString() === gameInfo.creator.toString()){
        deletable = true;
        } else {
        deletable = false;
        }        
      data = {
        gameInfo: gameInfo,
        gameCreator: userFromDB,
        deletable: deletable,
      };
      res.render('gameViews/details', data);
    })
    .catch((err) => {
      next(err);
    })
    })
  .catch((err)=>{
    next(err);
  });
});

module.exports = router;