const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const gameSchema = new Schema({
  name: String,
  creator: {type: Schema.Types.ObjectId, ref: "User"},
  liveURL: String,
  description: String,
  comments: [],
  image: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
