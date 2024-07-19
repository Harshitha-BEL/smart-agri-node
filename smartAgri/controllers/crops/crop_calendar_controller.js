const cropCalendar = require("../../model/crops/crop_calendar");
const Farm = require("../../model/farms/farm");
const cropMaster = require("../../model/crops/crop_mst");
const mongoose = require("mongoose");
const { sendSuccess, sendError } = require("../../util");
async function saveCropCalendar(req, res) {
  try {
    const acreCalculate = await Farm.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.body.farmId),
          userId: new mongoose.Types.ObjectId(req.body.userId),
        },
      },
      {
        $lookup: {
          from: "cropcalendars",
          foreignField: "farmId",
          localField: "_id",
          as: "crops",
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

    if (acreCalculate.length === 0) {
      return res.status(404).json({ error: "Farm not found" });
    }

    const farm = acreCalculate[0];

    if (req.body.acreCultivated > farm.availableAcre) {
      return res
        .status(400)
        .json({ error: "Not enough available acres to cultivate" });
    }
    const sowDate = new Date(req.body.sowDate);

    const newData = new cropCalendar({
      farmId: req.body.farmId,
      cropId: req.body.cropId,
      sowDate: req.body.sowDate,
      cultivationDate: req.body.cultivationDate,
      acreCultivated: req.body.acreCultivated,
      seasonId: req.body.seasonId,
    });

    const result = await newData.save();
    console.log(result);

    res.status(200).json({ msg: "Crop saved successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
}
async function getCropCalendar(req, res) {
  try {
    console.log(new Date().toISOString());

    const result = await cropCalendar.aggregate([
      {
        $lookup: {
          from: "cropmasters",
          foreignField: "_id",
          localField: "cropId",
          as: "crop",
        },
      },

      {
        $addFields: {
          cropName: { $arrayElemAt: ["$crop.crop", 0] },
          cropType: { $arrayElemAt: ["$crop.cropType", 0] },
          desc: { $arrayElemAt: ["$crop.desc", 0] },
          image: { $arrayElemAt: ["$crop.image", 0] },
          status: { $arrayElemAt: ["$crop.status", 0] },
        },
      },
      {
        $lookup: {
          from: "farms",
          foreignField: "_id",
          localField: "farmId",
          as: "farm",
        },
      },
      {
        $addFields: {
          farmName: { $arrayElemAt: ["$farm.name", 0] },
          userId: { $arrayElemAt: ["$farm.userId", 0] },
        },
      },
      {
        $lookup: {
          from: "seasons",
          foreignField: "_id",
          localField: "seasonId",
          as: "season",
        },
      },
      {
        $addFields: {
          seasonId: { $arrayElemAt: ["$season._id", 0] },
          seasonName: { $arrayElemAt: ["$season.name", 0] },
        },
      },
      {
        $match: { userId: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $project: {
          farm: 0,
          crop: 0,
          season: 0,
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
    ]);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function deleteCropCalendar(req, res) {
  try {
    const id = req.params.id;

    const deletedData = await cropCalendar.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.status(200).json({ msg: "Data deleted successfully", deletedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function updateCropCalendar(req, res) {
  try {
    const id = req.params.id;
    const myFarmCrop = await cropCalendar.findById(id);
    console.log(myFarmCrop);
    var update = {};
    var previousAcre;

    if (req.body.cropId) update.cropId = req.body.cropId;
    if (req.body.sowDate) update.sowDate = req.body.sowDate;

    if (req.body.acreCultivated || req.body.farmId) {
      if (!req.body.acreCultivated)
        return sendError(res, "Provide cultivated acre", 500);
      if (!req.body.farmId) return sendError(res, "Provide Farm details ", 500);

      const acreCalculate = await Farm.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.body.farmId),
          },
        },
        {
          $lookup: {
            from: "cropcalendars",
            foreignField: "farmId",
            localField: "_id",
            as: "crops",
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
     
      if (acreCalculate.length === 0) {
        return res.status(404).json({ error: "Farm not found" });
      }

      const farm = acreCalculate[0];

      if (
        myFarmCrop.farmId.equals(new mongoose.Types.ObjectId(req.body.farmId))
      ) {
        previousAcre = myFarmCrop.acreCultivated;
      } else {
        previousAcre = 0;
      }

      if (req.body.acreCultivated > farm.availableAcre + previousAcre) {
        return res
          .status(400)
          .json({ error: "Not enough available acres to cultivate" });
      }
      update.acreCultivated = req.body.acreCultivated;
      update.farmId = req.body.farmId;
    }

    if (req.body.seasonId) update.seasonId = req.body.seasonId;
    

    const result = await cropCalendar.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.status(200).json({ msg: "Data updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = {
  saveCropCalendar,
  getCropCalendar,
  deleteCropCalendar,
  updateCropCalendar,
};
