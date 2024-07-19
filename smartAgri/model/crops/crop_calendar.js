const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cropCalendarSchema = new mongoose.Schema(
  {
    farmId: {
      type: Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },

    cropId: {
      type: Schema.Types.ObjectId,
      ref: "cropMaster",
      required: true,
    },

    sowDate: { type: Date, required: true },
    cultivationDate: { type: Date },
    acreCultivated: { type: Number, required: true },

    seasonId: { type: Schema.Types.ObjectId, ref: "season", required: true },
    status: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const cropCalendar = mongoose.model("cropCalendar", cropCalendarSchema);

module.exports = cropCalendar;
