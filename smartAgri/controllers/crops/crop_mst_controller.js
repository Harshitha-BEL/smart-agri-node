const cropMaster = require("../../model/crops/crop_mst");

async function saveCropMst(req, res) {
  try {
    const newData = new cropMaster({
      crop: req.body.crop,
      cropType: req.body.type,
      desc: req.body.desc,
      image: req.body.image,
    });

    const result = await newData.save();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getCropMst(req, res) {
  try {
    const result = await cropMaster.aggregate([
      {
        $lookup: {
          from: "croptypemasters",
          localField: "cropType",
          foreignField: "_id",
          as: "cropMst",
        },
      },
      {
        $addFields: {
          cropTypeId: { $arrayElemAt: ["$cropMst._id", 0] },
          cropType: { $arrayElemAt: ["$cropMst.name", 0] },
        },
      },
      {
        $project: {
          cropMst: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function deleteCropMst(req, res) {
  try {
    const id = req.params.id;

    const deletedData = await cropMaster.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function updateCropMst(req, res) {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const result = await cropMaster.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Data updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = {
  saveCropMst,
  getCropMst,
  deleteCropMst,
  updateCropMst,
};
