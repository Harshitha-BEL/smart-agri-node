const mongoose = require("mongoose");

const soilTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true , unique: true },
    status: { type: Number, default: 0 },
    image: { type: String, required: true },
  },

  {
    timestamps: true,
  }
);

const soilType = mongoose.model("soilTypes", soilTypeSchema);

module.exports = soilType;
