const mongoose = require("mongoose");


const vipSchema = new mongoose.Schema({
  userID: { type: String, require: false, unique: true },
  profileBio: {type: String, default: null},
  profileImage: {type: String, default: null},
  profileThumbnail: {type: String, default: null},
  rankImage: { type: String, default: null},
  rankColor: { type: String, default: null}
});

const model = mongoose.model("VipModels", vipSchema);

module.exports = model;
