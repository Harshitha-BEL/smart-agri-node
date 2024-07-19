const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const talukSchema = new mongoose.Schema(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "districts",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    status: { type: Number, default: 0 },
  },

  {
    timestamps: true,
  }
);

const taluk = mongoose.model("taluks", talukSchema);

module.exports = taluk;
