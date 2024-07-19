const express = require("express");
const router = express.Router();
// const { image, getImg, upload } = require("../controllers/image_controller");
const {
  userSignup,
  userLogin,
  getUser,
  getAllUsers,
  saveProfie,
  upload,
  getImg,
  saveProfieImg,
} = require("../../controllers/users/user_controller");
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/getUser", getUser);
router.get("/getAllUsers", getAllUsers);
router.post("/saveProfie/:id", saveProfie);
router.post("/saveProfieImg/:id", upload.single("profileImg"), saveProfieImg);
router.get("/fetchImg/:id", getImg);
// router.post("/upload/:userId", upload.single("profileImg"), image);

module.exports = router;
