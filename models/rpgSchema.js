const mongoose = require("mongoose");


const rpgSchema = new mongoose.Schema({
  userID: { type: String, require: false, unique: true },
  item: { type: String, default: null },
  level: { type: Number, default: 1},
  health: { type: Number, default: null },
  damage: { type: Number, default: null },
  wins: { type: Number, default: 0 },
  loses: { type: Number, default: 0 },
  totalGames: { type: Number, default: 0 }
});

const model = mongoose.model("RpgModels", rpgSchema);

module.exports = model;
