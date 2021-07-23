const mongoose = require("mongoose");


const begSchema = new mongoose.Schema({
  userID: { type: String, require: false, unique: true },
  junk: {type: Number, default: 0},
  common: {type: Number, default: 0},
  uncommon: {type: Number, default: 0},
  rare: {type: Number, default: 0},
  legendary: {type: Number, default: 0},
  stars: { type: Number, default: 0},
  "vip1": {type: Boolean, default: false},
  "vip2": {type: Boolean, default: false}
});

const model = mongoose.model("BegModels", begSchema);

module.exports = model;
