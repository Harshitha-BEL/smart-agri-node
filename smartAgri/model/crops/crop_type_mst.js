const mongoose = require("mongoose");

const cropTypeMasterSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    status: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const cropTypeMst = mongoose.model("cropTypeMaster", cropTypeMasterSchema);

module.exports = cropTypeMst;
