const unitOfQuantity = require("../../model/others/unit_of_quantity");
async function saveQuantity(req, res) {
  try {
    const newData = new unitOfQuantity({
      ...req.body,
    });

    const result = await newData.save();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getQuantity(req, res) {
  try {
    const result = await unitOfQuantity.find();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}

async function updateQuantity(req, res) {
  try {
    const id = req.params.id;

    const updateFields = req.body;
    const result = await unitOfQuantity.findByIdAndUpdate(id, updateFields, {
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
  saveQuantity,
  getQuantity,
  updateQuantity,
};
