const mongoose = require("mongoose");


const memberSchema = new mongoose.Schema({
  serverID: { type: String, require: false, unique: true },
  userID: { type: String, require: false, unique: true },
  warns: { type: Array, default: []},
  tempRole: { type: String },
});

const model = mongoose.model("MemberModels", memberSchema);

module.exports = model;
