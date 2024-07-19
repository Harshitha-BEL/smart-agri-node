const express = require("express");
const router = express.Router();
const {
  saveFacility,
  getFacilities,
  updateFacility,
} = require("../../controllers/others/other_facilities_controller");
const {
  saveSoilType,
  getSoilTypes,
  updateSoilType,
} = require("../../controllers/others/soil_types_controller");
const {
  saveSeason,
  getSeason,
  updateSeason,
} = require("../../controllers/others/season_controller");

const {
  saveQuantity,
  getQuantity,
  updateQuantity,
} = require("../../controllers/others/unit_of_quantity_controller");

router.post("/saveFacility", saveFacility);
router.get("/getFacilities", getFacilities);
router.put("/updateFacility/:id", updateFacility);

router.post("/saveSoilType", saveSoilType);
router.get("/getSoilTypes", getSoilTypes);
router.put("/updateSoilType/:id", updateSoilType);

router.post("/saveSeason", saveSeason);
router.get("/getSeason", getSeason);
router.put("/updateSeason/:id", updateSeason);

router.post("/saveQuantity", saveQuantity);
router.get("/getQuantity", getQuantity);
router.put("/updateQuantity/:id", updateQuantity);

module.exports = router;
