const cropTypeMst = require("../../model/crops/crop_type_mst");

async function saveCropTypeMst(req, res) {
  try {
    const newData = new cropTypeMst({
      name: req.body.name,
    });

    const result = await newData.save();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getCropTypeMst(req, res) {
  try {
    const result = await cropTypeMst.find();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function deleteCropTypeMst(req, res) {
  try {
    const id = req.params.id;

    const deletedData = await cropTypeMst.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function updateCropTypeMst(req, res) {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const result = await cropTypeMst.findByIdAndUpdate(
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
  saveCropTypeMst,
  getCropTypeMst,
  deleteCropTypeMst,
  updateCropTypeMst,
};
