const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const image = mongoose.model("images", imageSchema);

module.exports = image;
  