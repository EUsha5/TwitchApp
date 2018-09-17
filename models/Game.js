const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const gameSchema = new Schema({
  creator: String,
  liveURL: String,
  description: String,
  comments: [],
  image: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
