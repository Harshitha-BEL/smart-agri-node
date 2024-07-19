const express = require("express");
const router = express.Router();
const {
  saveFarm,
  getFarm,
  deleteFarm,
  updateFarm,
  getMyFarm,
} = require("../../controllers/farms/farm_controller");

router.post("/saveFarm", saveFarm);
router.get("/getFarm", getFarm);
router.get("/getMyFarm/:userId", getMyFarm);
router.delete("/deleteFarm/:id", deleteFarm);
router.put("/updateFarm/:id", updateFarm);

module.exports = router;
