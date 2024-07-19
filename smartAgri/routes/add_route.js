const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../model/user");

/*router.get("/verify", (req, res) => {
  res.json("user verified");
});

async function verifyAccessToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  const refreshToken = req.headers.refresh_token;
  console.log(authorizationHeader + "auth");
  console.log(refreshToken + "refresh");

  if (!authorizationHeader && refreshToken) {
    try {
      const decodedRefreshToken = jwt.verify(refreshToken, "refreshSecretKey");
      const userId = decodedRefreshToken.userId;
      const newAccessToken = jwt.sign({ userId }, "secretKey", {
        expiresIn: "2m",
      });
      const user = await User.findOne({ _id: userId });
      console.log(user + "access1");
      const access1 = user.accessToken;
      const result = await User.findByIdAndUpdate(
        user._id,
        { newAccessToken },
        { new: true }
      );
      const acccess2 = result.accessToken;
      console.log(result + "access2");
      console.log(access1 === acccess2 + "equals");
      req.user = { userId: user._id };

      res.setHeader("Authorization", `Bearer ${newAccessToken}`);
      return next();
    } catch (error) {
      console.log("LLLLL" + error);
      return res.status(401).json({ error: "Please login" });
    }
  }
  if (!authorizationHeader) {
    return res.status(401).json({ error: "Access token missing" });
  }

  const accessToken = authorizationHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(accessToken, "secretKey");
    req.user = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: "Access token invalid or expired" });
  }
}

router.get("/protected", verifyAccessToken, (req, res) => {
  const userId = req.user.userId;
  const user = User.findById(userId);

  res.json({ userId });
});
*/

router.get("/verifyAccessToken", (req, res) => {
  console.log("hello" + req.headers.authorization);
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(402).json({ error: "Access token missing" });
  }
  const accessToken = authorizationHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(accessToken, "secretKey");
    req.user = { userId: decodedToken.userId };
    const userId = req.user.userId;
    res.status(200).json({ userId });
  } catch (error) {
    res.status(401).json({ error: "Access token invalid or expired" });
  }
});

router.get("/verifyRefreshToken", async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(402).json({ error: "Refresh token missing" });
  }

  const refreshToken = authorizationHeader.split(" ")[1];

  try {
    const decodedRefreshToken = jwt.verify(refreshToken, "refreshSecretKey");
    const userId = decodedRefreshToken.userId;
    const newAccessToken = jwt.sign({ userId }, "secretKey", {
      expiresIn: "2m",
    });

    const result = await User.findByIdAndUpdate(
      userId,
      { newAccessToken },
      { new: true }
    );
    if (result) {
      const user = await User.findOne({ _id: userId });
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(403).json({ error: "Please Login " });
  }
});

module.exports = router;
