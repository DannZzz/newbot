const mongoose = require("mongoose");


const memberSchema = new mongoose.Schema({
  serverID: { type: String, unique: false},
  userID: { type: String, unique: false},
  warns: { type: Array},
});

const model = mongoose.model("MemberModels", memberSchema);

module.exports = model;
