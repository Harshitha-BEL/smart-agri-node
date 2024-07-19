const mongoose = require("mongoose");

const unitOfQuantitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: Number, default: 0 },
  },

  {
    timestamps: true,
  }
);

const unitOfQuantity = mongoose.model("UnitOfQuantity", unitOfQuantitySchema);

module.exports = unitOfQuantity;
