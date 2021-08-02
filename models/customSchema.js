const mongoose = require("mongoose");


const customSchema = new mongoose.Schema({
  serverID: { type: String },
  command: { type: String, unique: true  },
  content: { type: String }
});

const model = mongoose.model("CustomModels", customSchema);

module.exports = model;
