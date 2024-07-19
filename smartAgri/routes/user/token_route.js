const express = require("express");
const router = express.Router();
const {
  verifyAccessToken,
  verifyRefreshToken,
} = require("../../controllers/users/token_controller");


router.get("/verifyAccessToken", verifyAccessToken);
router.get("/verifyRefreshToken", verifyRefreshToken);

module.exports = router;
