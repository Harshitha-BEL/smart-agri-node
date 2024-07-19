const express = require("express");
const router = express.Router();
const {
  saveCropTypeMst,
  getCropTypeMst,
  deleteCropTypeMst,
  updateCropTypeMst,
} = require("../../controllers/crops/crop_type_mst_controller");

router.post("/saveCropTypeMst", saveCropTypeMst);
router.get("/getCropTypeMst", getCropTypeMst);
router.delete("/deleteCropTypeMst/:id", deleteCropTypeMst);
router.put("/updateCropTypeMst/:id", updateCropTypeMst);

module.exports = router;
