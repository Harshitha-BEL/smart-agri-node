const mongoose = require("mongoose");

async function connectToMongoDB(url) {
  return mongoose
    .connect(url)
    .then("MongoDB Connected")
    .catch((err) => {
      console.log(err + "Error");
    });
}
module.exports = {
  connectToMongoDB,
};
