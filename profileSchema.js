const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  serverID: { type: String, require: true },
  coins: { type: Number, default: 1000 },
  bank: { type: Number, default: 0 },
  slots: { type: Number, default: 0 },
  rob: { type: Number, default: 0 },
  fish: { type: Number, default: 0 },
  work: {type: Number, default: 0 },
  daily: {type: Number, default: 0 },
  shopped: {any: {}}
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;
