const express = require("express");
const router = express.Router();
const {
  saveStates,
  getStates,
  saveDistrict,
  getDistrict,
  saveTaluk,
  getTaluk,
  getAllDistricts,
  getAllTaluks,
} = require("../../controllers/others/location_controller");
router.post("/saveStates", saveStates);
router.get("/getStates", getStates);

router.post("/saveDistrict", saveDistrict);
router.get("/getDistrict/:id", getDistrict);

router.post("/saveTaluk", saveTaluk);
router.get("/getTaluk/:id", getTaluk);

router.get("/getAllDistricts", getAllDistricts);
router.get("/getAllTaluks", getAllTaluks);

module.exports = router;
