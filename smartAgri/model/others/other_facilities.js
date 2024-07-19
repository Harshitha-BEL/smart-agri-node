const mongoose = require("mongoose");

const otherFacilitiesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: Number, default: 0 },
  },

  {
    timestamps: true,
  }
);

const otherFacilities = mongoose.model(
  "otherFacilities",
  otherFacilitiesSchema
);

module.exports = { otherFacilities, otherFacilitiesSchema };
