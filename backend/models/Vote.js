const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  vote: { type: String, required: true },
  ip: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Vote", voteSchema);
