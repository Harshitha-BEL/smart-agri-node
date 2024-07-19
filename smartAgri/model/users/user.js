const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    accessToken: { type: String },
    refreshToken: { type: String },
    role: { type: [String] },
    profileImg: { type: String },
    stateId: { type: Schema.Types.ObjectId, ref: "states" },
    stateName: { type: String },
    districtId: {
      type: Schema.Types.ObjectId,
      ref: "districts",
    },
    districtName: { type: String },
    talukId: { type: Schema.Types.ObjectId, ref: "taluks" },
    talukName: { type: String },
    address: { type: String, min: 5, max: 200 },
    place: { type: String },
    gender: {
      type: Number,
    },
    phoneNumber: {
      type: Number,
    },
    pinCode: {
      type: Number,
    },
    status: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
