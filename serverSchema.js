const mongoose = require("mongoose");
const { PREFIX } = require("./config")

const serverSchema = new mongoose.Schema({
  serverID: { type: String, require: true, unique: true },
  prefix: { type: String, default: PREFIX},
  modLog: { type: String },
  muteRole: { type: String },
  shop: {any: {} },

});

const model = mongoose.model("ServerModels", serverSchema);

module.exports = model;
