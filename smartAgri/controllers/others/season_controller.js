const season = require("../../model/others/season");
async function saveSeason(req, res) {
  try {
    const newData = new season({
      ...req.body,
    });

    const result = await newData.save();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getSeason(req, res) {
  try {
    const result = await season.find();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}

async function updateSeason(req, res) {
  try {
    const id = req.params.id;

    const updateFields = req.body;
    const result = await season.findByIdAndUpdate(id, updateFields, {
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
  saveSeason,
  getSeason,
  updateSeason,
};
