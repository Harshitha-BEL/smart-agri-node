const express = require("express");
const cors = require("cors");
const { connectToMongoDB } = require("./connection");
const userRouter = require("./routes/user/user_route");
const userVerify = require("./routes/user/token_route");
const cropType = require("./routes/crops/crop_type_mst_router");
const crop = require("./routes/crops/crop_mst_router");
const farm = require("./routes/farms/farm_router");
const farmMarket = require("./routes/farms/farm_market_route");
const cropCalendar = require("./routes/crops/crop_calendar_routes");
const jobs = require("./routes/jobs/job_route");
const jobseeker = require("./routes/jobs/job_seeker_route");
const facility = require("./routes/others/other_facilities_route");
const location = require("./routes/others/location_route");
connectToMongoDB("mongodb://127.0.0.1:27017/smartagri")
  .then("MongoDB Connected")
  .catch((err) => {
    console.log(err + "Error");
  });
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/", userVerify);
app.use("/cropType", cropType);
app.use("/crop", crop);
app.use("/farm", farm);
app.use("/farmMarket", farmMarket);
app.use("/cropCalendar", cropCalendar);
app.use("/jobs", jobs);
app.use("/jobseeker", jobseeker);
app.use("/others", facility);
app.use("/location", location);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
