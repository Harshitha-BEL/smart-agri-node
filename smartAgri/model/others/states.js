const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true  },
    status: { type: Number, default: 0 },
  },

  {
    timestamps: true,
  }
);

const state = mongoose.model("states", stateSchema);

module.exports = state;
