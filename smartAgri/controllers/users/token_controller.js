const jwt = require("jsonwebtoken");
const User = require("../../model/users/user");

async function verifyAccessToken(req, res) {
  console.log("access token is called ");
  // console.log("hello" + req.headers.authorization);
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
    console.log("access token is success ");
  } catch (error) {
    console.log("access token is fail ");
    res.status(401).json({ error: "Access token invalid or expired" });
  }
}
async function verifyRefreshToken(req, res) {
  console.log("refresh token is called ");
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(402).json({ error: "Refresh token missing" });
  }

  const refreshToken = authorizationHeader.split(" ")[1];

  try {
    const decodedRefreshToken = jwt.verify(refreshToken, "refreshSecretKey");
    const userId = decodedRefreshToken.userId;
    const newAccessToken = jwt.sign({ userId }, "secretKey", {
      expiresIn: "2h",
    });

    const result = await User.findByIdAndUpdate(
      userId,
      { newAccessToken },
      { new: true }
    );
    if (result) {
      const user = await User.findOne({ _id: userId });
      console.log(user);
      res.status(200).json(user);
    }

    console.log("refresh token is success ");
  } catch (error) {
    console.log("refresh token is failed ");
    res.status(403).json({ error: "Please Login " });
  }
}
/*
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
*/
module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};
