const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  fish: { type: Number, default: 0 },
  daily: {type: Number, default: 0 },
  bug: {type: Number, default: 0 },
  drag: { type: Number, default: 0},
  rpg: { type: Number, default: 0},
  survive: { type: Number, default: 0},
  shopped: {any: {}}
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;
