const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    img: {
      type: String,
      required: true,
    },
    status: { type: Number, default: 0 },
  },

  {
    timestamps: true,
  }
);

const season = mongoose.model("season", seasonSchema);

module.exports = season;
