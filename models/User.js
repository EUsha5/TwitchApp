const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  googleID: String,
  first: String,
  last: String,
  games: [],
  comments: [],
  Avatar: {type: String, default: "https://i.pinimg.com/originals/db/d7/45/dbd74562d9c8e30188bf7c71e901ee85.jpg"},
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;