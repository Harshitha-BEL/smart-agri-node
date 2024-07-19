const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const farmSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    acre: { type: Number, required: true },
    soil: { type: String, required: true },
    latLong: {
      type: Schema.Types.Mixed,

      validate: {
        validator: function (value) {
          // Check if it's an array and contains exactly 2 elements
          return (
            Array.isArray(value) &&
            value.length === 2 &&
            typeof value[0] === "number" &&
            typeof value[1] === "number"
          );
        },
        message: "latLong must be an array containing exactly 2 numbers",
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String },
  },

  {
    timestamps: true,
  }
);

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
