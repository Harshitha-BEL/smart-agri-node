const { otherFacilities } = require("../../model/others/other_facilities");
async function saveFacility(req, res) {
  try {
    const newData = new otherFacilities({
      ...req.body,
    });

    const result = await newData.save();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getFacilities(req, res) {
  try {
    const result = await otherFacilities.find();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}

async function updateFacility(req, res) {
  try {
    const id = req.params.id;

    const updateFields = req.body;
    const result = await otherFacilities.findByIdAndUpdate(id, updateFields, {
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
  saveFacility,
  getFacilities,
  updateFacility,
};
