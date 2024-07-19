const FarmMarket = require("../../model/farms/farm_market");
const { compressImage } = require("../users/image_controller");
const mongoose = require("mongoose");
const Image = require("../../model/users/images");
const User = require("../../model/users/user");
const cropMaster = require("../../model/crops/crop_mst");
const UnitOfQuantity = require("../../model/others/unit_of_quantity");
const { sendSuccess, sendError } = require("../../util");

async function saveFarmMarket(req, res) {
  var cropImg;
  try {
    if (!req.file) {
      return res.status(400).send("No file selected!");
    }
    const compressedImageBuffer = await compressImage(req.file.buffer);

    const newImage = new Image({
      data: compressedImageBuffer,
      contentType: req.file.mimetype,
    });

    const imgResult = await newImage.save();

    if (imgResult) {
      cropImg = "http://172.16.68.159:3000/user/fetchImg/" + newImage._id;
    } else {
      return res.status(500).send({ error: "Image could not be saved" });
    }

    const crop = await cropMaster.findById(req.body.cropId);
    if (!crop) {
      return res.status(400).send({ error: "Crop not found" });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    const unitOfQuantity = await UnitOfQuantity.findById(
      req.body.unitOfQuantity
    );
    if (!unitOfQuantity) {
      return res.status(400).send({ error: "Unit not found" });
    }

    const newData = new FarmMarket({
      cropId: crop._id,
      image: cropImg,
      latLong: JSON.parse(req.body.latLong),
      userId: user._id,
      price: req.body.price,
      quantity: req.body.quantity,
      unit: unitOfQuantity._id,
    });

    const result = await newData.save();
    if (result) sendSuccess(res, "Product saved successfully");
    else sendError(res, "Something went wrong, Please try after sometime", 500);
  } catch (e) {
    console.log(e);
    sendError(res, e.message, 500);
  }
}
async function getFarmMarket(req, res) {
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  try {
    const crops = await cropMaster.aggregate([
      {
        $lookup: {
          from: "farmmarkets",
          localField: "_id",
          foreignField: "cropId",
          as: "farmerProducts",
        },
      },
      {
        $addFields: {
          farmerProducts: {
            $filter: {
              input: "$farmerProducts",
              as: "product",
              cond: { $ne: ["$$product.userId", userId] },
            },
          },
        },
      },
      {
        $match: {
          farmerProducts: { $ne: [] },
        },
      },
      {
        $unwind: {
          path: "$farmerProducts",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "farmerProducts.userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "unitofquantities",
          localField: "farmerProducts.unit",
          foreignField: "_id",
          as: "unit",
        },
      },
      {
        $unwind: {
          path: "$unitDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "farmerProducts.sellerId": { $arrayElemAt: ["$userDetails._id", 0] },
          "farmerProducts.sellerName": {
            $arrayElemAt: ["$userDetails.name", 0],
          },
          "farmerProducts.email": { $arrayElemAt: ["$userDetails.email", 0] },
          "farmerProducts.address": {
            $arrayElemAt: ["$userDetails.address", 0],
          },
          "farmerProducts.districtName": {
            $arrayElemAt: ["$userDetails.districtName", 0],
          },
          "farmerProducts.districtId": {
            $arrayElemAt: ["$userDetails.districtId", 0],
          },
          "farmerProducts.phoneNumber": {
            $arrayElemAt: ["$userDetails.phoneNumber", 0],
          },
          "farmerProducts.pinCode": {
            $arrayElemAt: ["$userDetails.pinCode", 0],
          },

          "farmerProducts.place": { $arrayElemAt: ["$userDetails.place", 0] },
          "farmerProducts.stateId": {
            $arrayElemAt: ["$userDetails.stateId", 0],
          },
          "farmerProducts.stateName": {
            $arrayElemAt: ["$userDetails.stateName", 0],
          },
          "farmerProducts.talukId": {
            $arrayElemAt: ["$userDetails.talukId", 0],
          },
          "farmerProducts.talukName": {
            $arrayElemAt: ["$userDetails.talukName", 0],
          },
          "farmerProducts.rating": { $arrayElemAt: ["$userDetails.rating", 0] },

          "farmerProducts.unitId": { $arrayElemAt: ["$unit._id", 0] },
          "farmerProducts.unitName": { $arrayElemAt: ["$unit.name", 0] },
        },
      },
      {
        $group: {
          _id: "$_id",
          crop: { $first: "$crop" },
          cropType: { $first: "$cropType" },
          desc: { $first: "$desc" },
          image: { $first: "$image" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          farmerProducts: { $push: "$farmerProducts" },
        },
      },
    ]);
    res.status(200).json(crops);
    // res.status(200).json(result);
  } catch (e) {
    sendError(res, e.message, 500);
  }
}
async function getMyFarmMarket(req, res) {
  try {
    const userId = req.params.userId;

    const crops = await FarmMarket.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "cropcalendars",
          localField: "_id",
          foreignField: "farmId",
          as: "cropCalendars",
        },
      },
      {
        $unwind: {
          path: "$cropCalendars",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "cropmasters",
          localField: "cropCalendars.cropId",
          foreignField: "_id",
          as: "cropCalendars.cropDetails",
        },
      },
      {
        $unwind: {
          path: "$cropCalendars.cropDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          acre: { $first: "$acre" },
          soil: { $first: "$soil" },

          userId: { $first: "$userId" },
          latLong: { $first: "$latLong" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          crops: {
            $push: {
              _id: "$cropCalendars._id",
              cropName: "$cropCalendars.cropDetails.crop",
              cropType: "$cropCalendars.cropDetails.cropType",
              image: "$cropCalendars.cropDetails.image",
              sowDate: "$cropCalendars.sowDate",
              acreCultivated: "$cropCalendars.acreCultivated",
              description: "$cropCalendars.description",
              season: "$cropCalendars.season",
              cropAge: "$cropCalendars.cropAge",
              createdAt: "$cropCalendars.createdAt",
              updatedAt: "$cropCalendars.updatedAt",
            },
          },
        },
      },
      {
        $addFields: {
          crops: {
            $cond: {
              if: { $eq: ["$crops", [{}]] },
              then: [],
              else: "$crops",
            },
          },
        },
      },
      {
        $addFields: {
          totalAcreCultivated: { $sum: "$crops.acreCultivated" },
          availableAcre: {
            $subtract: ["$acre", { $sum: "$crops.acreCultivated" }],
          },
        },
      },
    ]);

    res.status(200).json(crops);
  } catch (err) {
    sendError(res, e.message, 500);
  }
}
async function deleteFarmMarket(req, res) {
  try {
    const id = req.params.id;

    const deletedData = await FarmMarket.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    sendError(res, e.message, 500);
  }
}
async function updateFarmMarket(req, res) {
  try {
    const id = req.params.id;

    const updateFields = req.body;
    const result = await FarmMarket.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Data updated successfully", result });
  } catch (error) {
    sendError(res, e.message, 500);
  }
}
module.exports = {
  saveFarmMarket,
  getFarmMarket,
  deleteFarmMarket,
  updateFarmMarket,
  getMyFarmMarket,
};
