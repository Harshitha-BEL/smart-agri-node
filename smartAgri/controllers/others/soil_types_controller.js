const soilType = require("../../model/others/soil_type");
async function saveSoilType(req, res) {
  try {
    const newData = new soilType({
      ...req.body,
    });

    const result = await newData.save();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getSoilTypes(req, res) {
  try {
    const result = await soilType.find();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}

async function updateSoilType(req, res) {
  try {
    const id = req.params.id;

    const updateFields = req.body;
    const result = await soilType.findByIdAndUpdate(id, updateFields, {
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
  saveSoilType,
  getSoilTypes,
  updateSoilType,
};
