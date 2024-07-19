const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Image = require("../../model/users/images");
const mongoose = require("mongoose");

const User = require("../../model/users/user");
const State = require("../../model/others/states");
const District = require("../../model/others/districts");
const Taluk = require("../../model/others/taluks");
const { stat } = require("fs");

const phoneRegex = /^\d{10}$/;
const pinCodeRegex = /^\d{6}$/;
function generateAccessToken(userId) {
  return jwt.sign({ userId }, "secretKey", { expiresIn: "2h" });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, "refreshSecretKey", { expiresIn: "24h" });
}

async function userSignup(req, res) {
  try {
    const newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    });

    const accessToken = generateAccessToken(newUser._id);

    const refreshToken = generateRefreshToken(newUser._id);

    newUser.accessToken = accessToken;
    newUser.refreshToken = refreshToken;

    const result = await newUser.save();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
}

async function userLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || password !== user.password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id);

    const response = await User.findByIdAndUpdate(
      user._id,
      { accessToken, refreshToken },
      { new: true }
    );
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error });
  }
}
async function getUser(req, res) {
  const token = req.headers.authorization;

  try {
    const accessToken = token.split(" ")[1];
    const decodedToken = jwt.verify(accessToken, "secretKey");
    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error });
  }
}
async function getAllUsers(req, res) {
  try {
    const user = await User.find({});

    if (!user) {
      return res.status(404).json({ error: "Users not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error });
  }
}

async function saveProfieImg(req, res) {
  const userId = req.params.id;
  const user = await User.findById(userId);
  try {
    if (!user) {
      return res.status(404).json({ error: "Users not found" });
    }
    if (!req.file) {
      return res.status(400).send({ error: "No file selected!" });
    }

    const newImage = new Image({
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    const imgResult = await newImage.save();
    if (imgResult) {
      user.profileImg =
        "http://172.16.68.159:3000/user/fetchImg/" + newImage._id;
    } else {
      return res.status(500).send({ error: "Image could not be saved" });
    }
    const result = await user.save();

    res.status(200).json(result.profileImg);
  } catch (e) {
    console.log(error);
    res.status(401).json({ error: error });
  }
}

async function saveProfie(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Users not found" });
    }
    console.log(req.body);
    const validationError = validateFields(requiredFields, req.body);
    if (validationError) {
      return res.status(400).send({ error: validationError });
    }

    const { entity: state, error: stateError } = await validateLoc(
      req.body.stateId,
      "State",
      State,
      null
    );
    if (state) {
      user.stateId = state._id;
      user.stateName = state.name;
    } else return res.status(400).send({ error: stateError });

    const { entity: district, error: districtError } = await validateLoc(
      req.body.districtId,
      "District",
      District,
      state._id
    );
    if (district) {
      user.districtId = district._id;
      user.districtName = district.name;
    } else return res.status(400).send({ error: districtError });

    const { entity: taluk, error: talukError } = await validateLoc(
      req.body.talukId,
      "Taluk",
      Taluk,
      district._id
    );
    if (taluk) {
      user.talukId = taluk._id;
      user.talukName = taluk.name;
    } else return res.status(400).send({ error: talukError });

    const phoneError = validateRegex(
      req.body.phoneNumber,
      phoneRegex,
      "Phone number must be exactly 10 digits"
    );
    if (phoneError) {
      return res.status(400).send({ error: phoneError });
    }

    const pinCodeError = validateRegex(
      req.body.pinCode,
      pinCodeRegex,
      "Pincode must be exactly 6 digits"
    );
    if (pinCodeError) {
      return res.status(400).send({ error: pinCodeError });
    }

    updateUserFields(user, req.body);

    const result = await user.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error });
  }
}

async function getImg(req, res) {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).send("Image not found");
    }

    res.contentType(image.contentType);
    res.send(image.data);
  } catch (err) {
    res.status(500).send("Server error");
  }
}
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
});

const validateFields = (fields, body) => {
  const msg = "Please provide ";
  for (const { field, message } of fields) {
    if (
      !body[field] ||
      (typeof body[field] === "string" && body[field].trim() === "")
    ) {
      return msg + message;
    }
  }
  return null;
};

const validateRegex = (field, regex, message) => {
  if (!regex.test(field)) {
    return message;
  }
  return null;
};

const requiredFields = [
  { field: "stateId", message: "state ID" },
  { field: "stateName", message: "state Name" },
  { field: "districtId", message: "district ID" },
  { field: "districtName", message: "district Name" },
  { field: "talukId", message: "taluk ID" },
  { field: "talukName", message: "taluk Name" },
  { field: "address", message: "address" },
  { field: "place", message: "place" },
  { field: "phoneNumber", message: "phone number" },
  { field: "pinCode", message: "pincode" },
  { field: "name", message: "name" },
];

const updateUserFields = (user, body) => {
  user.address = body.address;
  user.place = body.place;
  user.phoneNumber = body.phoneNumber;
  user.pinCode = body.pinCode;
  user.name = body.name;

  if (!user.role.includes("Farmer")) {
    user.role.push("Farmer");
  }
};

const validateLoc = async (id, errorName, Model, parentId) => {
  const entity = await Model.findById(id);

  if (!entity) return { error: `${errorName} not found` };

  if (parentId && !entity["parentId"].equals(parentId))
    return {
      error: `Invalid ${errorName}`,
    };

  return { entity };
};
module.exports = {
  userSignup,
  userLogin,
  getUser,
  getAllUsers,
  saveProfie,
  upload,
  getImg,
  saveProfieImg,
};

// const msg = "Please provide ";
// const requiredFields = [
//   { field: "stateId", message: "state ID" },
//   { field: "stateName", message: "state Name" },
//   { field: "districtId", message: "district ID" },
//   { field: "districtName", message: "district Name" },
//   { field: "talukId", message: "taluk ID" },
//   { field: "talukName", message: "taluk Name" },
//   { field: "address", message: "address" },
//   { field: "place", message: "place" },
//   { field: "phoneNumber", message: "phone number" },
//   { field: "pinCode", message: "pincode" },
//   { field: "name", message: "name" },
// ];

// for (const { field, message } of requiredFields) {
//   if (!req.body[field] || req.body[field] === "") {
//     return res.status(400).send({ error: msg + message });
//   }
// }

// if (!req.file) {
//   return res.status(400).send("No file selected!");
// }
// if (!phoneRegex.test(req.body.phoneNumber)) {
//   return res
//     .status(400)
//     .send({ error: "Phone number must be exactly 10 digits" });
// }
// if (!pinCodeRegex.test(req.body.pinCode)) {
//   return res
//     .status(400)
//     .send({ error: "Pincode must be exactly 6 digits" });
// }

// user.stateId = req.body.stateId;
// user.stateName = req.body.stateName;
// user.districtName = req.body.districtName;
// user.districtId = req.body.districtId;
// user.talukId = req.body.talukId;
// user.talukName = req.body.talukName;
// user.address = req.body.address;
// user.place = req.body.place;
// user.phoneNumber = req.body.phoneNumber;
// user.pinCode = req.body.pinCode;
// user.pinCode = req.body.pinCode;
// user.role.push("Farmer");
// user.name = req.body.name;

/* if (!mongoose.Types.ObjectId.isValid(req.body.stateId)) {
      return res.status(400).send({ error: "Invalid stateId format" });
    }
    const state = await State.findById(req.body.stateId);
    if (!state) {
      return res.status(404).send({ error: "State not found" });
    }
    user.stateId = state._id;
    user.stateName = state.name;

    if (!mongoose.Types.ObjectId.isValid(req.body.districtId)) {
      return res.status(400).send({ error: "Invalid districtId format" });
    }
    const district = await District.findById(req.body.districtId);
    console.log(district.parentId);
    console.log(state._id);
    if (!district) {
      return res.status(404).send({ error: "District not found" });
    } else if (!district.parentId.equals(state._id)) {
      return res
        .status(404)
        .send({ error: "This district belongs to different state" });
    }

    user.districtId = district._id;
    user.districtName = district.name;
    if (!mongoose.Types.ObjectId.isValid(req.body.talukId)) {
      return res.status(400).send({ error: "Invalid talukId format" });
    }
    const taluk = await Taluk.findById(req.body.talukId);

    if (!taluk) {
      return res.status(404).send({ error: "Taluk not found" });
    } else if (taluk.parentId !== district._id) {
      return res
        .status(404)
        .send({ error: "This taluk belongs to different district" });
    }

    user.talukId = taluk._id;
    user.talukName = taluk.name;*/
