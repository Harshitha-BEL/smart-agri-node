const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const districtSchema = new mongoose.Schema(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "states",
      required: true,unique:true
    },
    name: { type: String, required: true },
    status: { type: Number, default: 0 },
  },

  {
    timestamps: true,
  }
);

const district = mongoose.model("districts", districtSchema);

module.exports = district;
