const mongoose = require("mongoose");
const { PREFIX } = require("./../config")

const serverSchema = new mongoose.Schema({
  serverID: { type: String, require: true, unique: true },
  prefix: { type: String, default: PREFIX},
  modLog: { type: String },
  muteRole: { type: String },
  autoRole: { type: String },
  autoRoleOn: { type: Boolean, default: false},
  welcome: { type: Boolean, default: false},
  welcomeText: { type: String},
  welcomeChannel: { type: String},
  welcomeColor: { type: String},
  welcomeImage: { type: String},
  shop: {any: {} },
  rank: { type: Boolean, default: false},
  voiceCategory: { type: String, default: null},
  voiceChannel: { type: String, default: null},
});

const model = mongoose.model("ServerModels", serverSchema);

module.exports = model;
