const Farm = require("../../model/farms/farm");
const mongoose = require("mongoose");
async function saveFarm(req, res) {
  try {
    const newData = new Farm({
      name: req.body.name,
      acre: req.body.acre,
      soil: req.body.soil,
      latLong: req.body.latLong,
      userId: req.body.userId,
      description: req.body.description,
    });

    const result = await newData.save();

    res.status(200).json({ msg: "Farm saved successfully" });
   
  } catch (e) {
    sendError(res, "Invalid latLong format");
    res.status(500).json({ error: e.message });
  }
}
async function getFarm(req, res) {
  try {
    const result = await Farm.find();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getMyFarm(req, res) {
  try {
    const userId = req.params.userId;

    const crops = await Farm.aggregate([
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

    // function transformData(data) {
    //   return data.map((item) => {
    //     return {
    //       _id: item._id,
    //       name: item.name,
    //       soil: item.soil,
    //       acre: item.acre,
    //       userId: item.userId,
    //       latLong: item.latLong,
    //       createdAt: item.createdAt,
    //       updatedAt: item.updatedAt,
    //       crops: item.crops.filter((crop) => Object.keys(crop).length > 0),
    //     };
    //   });
    // }
    // res.status(200).json(transformData(crops));
    res.status(200).json(crops);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}
async function deleteFarm(req, res) {
  try {
    const id = req.params.id;

    const deletedData = await Farm.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function updateFarm(req, res) {
  try {
    const id = req.params.id;

    const updateFields = req.body;
    const result = await Farm.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Data updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = {
  saveFarm,
  getFarm,
  deleteFarm,
  updateFarm,
  getMyFarm,
};
/**{
        $lookup: {
          from: "farms",
          localField: "farmId",
          foreignField: "_id",
          as: "farm",
        },
      },
      {
        $unwind: "$farm",
      },
      {
        $match: { "farm.userId": new mongoose.Types.ObjectId(userId) },
      }, */
