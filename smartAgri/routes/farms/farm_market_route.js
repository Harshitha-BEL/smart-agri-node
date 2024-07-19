const express = require("express");
const router = express.Router();
const { upload } = require("../../controllers/users/user_controller");
const {
  saveFarmMarket,
  getFarmMarket,
  deleteFarmMarket,
  updateFarmMarket,
  getMyFarmMarket,
} = require("../../controllers/farms/farm_market_controller");

router.post("/saveFarmMarket", upload.single("cropImg"), saveFarmMarket);
router.get("/getFarmMarket/:userId", getFarmMarket);
// router.get("/getMyFarm/:userId", getMyFarm);
// router.delete("/deleteFarm/:id", deleteFarm);
// router.put("/updateFarm/:id", updateFarm);

module.exports = router;
