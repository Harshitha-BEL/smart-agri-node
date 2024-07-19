const express = require("express");
const router = express.Router();
const {
  saveCropMst,
  getCropMst,
  deleteCropMst,
  updateCropMst,
} = require("../../controllers/crops/crop_mst_controller");

router.post("/saveCropMst", saveCropMst);
router.get("/getCropMst", getCropMst);
router.delete("/deleteCropMst/:id", deleteCropMst);
router.put("/updateCropMst/:id", updateCropMst);

module.exports = router;
