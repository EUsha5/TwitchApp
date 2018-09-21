const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  googleID: String,
  first: String,
  last: String,
  aboutme: String,
  games: [{type: Schema.Types.ObjectId, ref: "Game"},],
  comments: [],
  avatar: {type: String, default: "/images/linkedin_profile_image copy.png"},
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;