const mongoose = require("mongoose");

const voiceSchema = new mongoose.Schema({
  userID: { type: String },
  serverID: { type: String },
  channel: { type: String }
});

const model = mongoose.model("VoiceModels", voiceSchema);

module.exports = model;
