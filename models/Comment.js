const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const commentSchema = new Schema({
  owner: String,
  comment: String,
  forType: User, Game,
  about: String,
}, {
  timestamps: {createdAt: "created_at", updatedAt: "updated_at"}
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;