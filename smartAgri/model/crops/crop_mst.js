const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cropMasterSchema = new mongoose.Schema(
  {
    crop: { type: String, unique: true, required: true },
    cropType: {
      type: Schema.Types.ObjectId,
      ref: "cropTypeMaster",
      required: true,
    },
    desc: { type: String, required: true },
    image: { type: String, required: true },status: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const cropMaster = mongoose.model("cropMaster", cropMasterSchema);

module.exports = cropMaster;
