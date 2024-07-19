const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const farmFarmMarketSchema = new mongoose.Schema(
  {
    cropId: {
      type: Schema.Types.ObjectId,
      ref: "cropMaster",
      required: true,
    },
    image: { type: String },
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
      required: true,
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: {
      type: Schema.Types.ObjectId,
      ref: "UnitOfQuantity",
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const FarmMarket = mongoose.model("FarmMarket", farmFarmMarketSchema);

module.exports = FarmMarket;
