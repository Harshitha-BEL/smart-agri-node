const express = require("express");
const router = express.Router();

const {
  updateCropCalendar,
  saveCropCalendar,
  deleteCropCalendar,
  getCropCalendar,
} = require("../../controllers/crops/crop_calendar_controller");

router.post("/saveCropCalender", saveCropCalendar);
router.get("/getCropCalender/:id", getCropCalendar);
router.delete("/deleteCropCalender/:id", deleteCropCalendar);
router.put("/updateCropCalender/:id", updateCropCalendar);

module.exports = router;
