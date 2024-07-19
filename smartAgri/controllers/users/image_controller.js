const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const User = require("../../model/users/user");
const Image = require("../../model/users/images");

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

async function compressImage(buffer) {
  let compressedBuffer = buffer;
  let quality = 80; // Start with a high quality

  do {
    compressedBuffer = await sharp(buffer)
      .resize(500, 500, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .jpeg({ quality }) // Adjust format and quality
      .toBuffer();

    quality -= 5; // Decrease quality incrementally
  } while (compressedBuffer.length > 5 * 1024 * 1024 && quality > 0);

  return compressedBuffer;
}
async function image(req, res) {
  if (!req.file) {
    return res.status(400).send("No file selected!");
  }
  const compressedImageBuffer = await compressImage(req.file.buffer);

  const newImage = new Image({
    data: compressedImageBuffer,
    contentType: req.file.mimetype,
  });

  await newImage.save();

  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).send("User not found");
  }
  user.profileImg = "http://172.16.68.159:3000/user/fetchImg/" + newImage._id;
  await user.save();

  res.send("File uploaded and profile updated!");
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
module.exports = { image, getImg, upload, compressImage };
