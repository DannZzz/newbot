const mongoose = require("mongoose");
const { PREFIX } = require("./../config")

const serverSchema = new mongoose.Schema({
  serverID: { type: String, require: true, unique: true },
  prefix: { type: String, default: PREFIX},
  modLog: { type: String },
  muteRole: { type: String },
  autoRole: { type: String },
  autoRoleOn: { type: Boolean, default: false},
  shop: {any: {} },
  rank: { type: Boolean, default: false},

});

const model = mongoose.model("ServerModels", serverSchema);

module.exports = model;
