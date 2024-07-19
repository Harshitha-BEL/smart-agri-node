const Job = require("../../model/jobs/job");
const Farm = require("../../model/farms/farm");
const cropCalendar = require("../../model/crops/crop_calendar");
const cropMaster = require("../../model/crops/crop_mst");
const {
  otherFacilities: otherFacility,
} = require("../../model/others/other_facilities");
const mongoose = require("mongoose");

async function createJob(req, res) {
  try {
    const {
      cropId,
      cropName,
      farmName,
      farmId,
      distance,
      maleCount,
      femaleCount,
      maleSalary,
      femaleSalary,
      extra,
      fromDate,
      toDate,
      duration,
      userId,
      otherFacilities,
      jobDescription,
    } = req.body;

    const validateFarm = await Farm.findOne({ _id: farmId, userId: userId });

    if (!validateFarm) {
      return res.status(400).send({ error: "Enter valid Farm Id" });
    }
    const farm_id = validateFarm._id;
    const farm_name = validateFarm.name;

    const validateCrop = await cropCalendar.findOne({
      _id: cropId,
      farmId: farm_id,
    });
    if (!validateCrop) {
      return res.status(400).send({ error: "Enter valid Crop Id" });
    }
    const crop_id = validateCrop._id;

    const cropMst = await cropMaster.findById(validateCrop.cropId);
    const crop_Name = cropMst ? cropMst.crop : null;
    const image = cropMst ? cropMst.image : null;
    const facility = [];

    const fromDateUTC = new Date(fromDate).toISOString();
    const toDateUTC = new Date(toDate).toISOString();

    await Promise.all(
      otherFacilities.map(async (element) => {
        const valid_id = await otherFacility.findOne({
          _id: element["id"],
          status: 0,
        });
        if (valid_id) {
          facility.push(valid_id);
        }
      })
    );

    const newData = new Job({
      cropId: crop_id,
      cropName: crop_Name,
      farmId: farm_id,
      farmName: farm_name,
      image,
      distance,
      maleCount,
      femaleCount,
      maleSalary,
      femaleSalary,
      extra,
      fromDate,
      toDate,
      duration,
      userId,
      availMale: maleCount,
      availFemale: femaleCount,
      otherFacilities: facility,
      jobDescription,
    });

    const result = await newData.save();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
}
async function getAllJobs(req, res) {
  try {
    const result = await Job.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "employeer",
        },
      },
    ]);

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}

async function getJobs(req, res) {
  const searchQuery = req.body.searchQuery || "";
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  try {
    const result = await Job.aggregate([
      {
        $match: {
          userId: { $ne: userId },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $addFields: { employeer: { $first: "$result" } },
      },
      {
        $project: {
          result: 0,

          "employeer.password": 0,
          "employeer.accessToken": 0,
          "employeer.refreshToken": 0,
          "employeer.createdAt": 0,
          "employeer.updatedAt": 0,
          "employeer.__v": 0,
          "employeer.profileImg": 0,
          "employeer.email": 0,
          "employeer.status": 0,
        },
      },

      {
        $lookup: {
          from: "jobseekers",
          let: { jobId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$jobId", "$$jobId"] },
                    { $eq: ["$userId", userId] }, // Match the provided userId
                  ],
                },
              },
            },
          ],
          as: "seeker",
        },
      },
      {
        $unwind: {
          path: "$seeker",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "seeker.userId",
          foreignField: "_id",
          as: "seekerDetails",
        },
      },
      {
        $addFields: {
          "seeker.userName": { $arrayElemAt: ["$seekerDetails.name", 0] },
          "seeker.address": { $arrayElemAt: ["$seekerDetails.address", 0] },

          "seeker.districtId": {
            $arrayElemAt: ["$seekerDetails.districtId", 0],
          },
          "seeker.districtName": {
            $arrayElemAt: ["$seekerDetails.districtName", 0],
          },
          "seeker.phoneNumber": {
            $arrayElemAt: ["$seekerDetails.phoneNumber", 0],
          },
          "seeker.pinCode": { $arrayElemAt: ["$seekerDetails.pinCode", 0] },
          "seeker.place": { $arrayElemAt: ["$seekerDetails.place", 0] },
          "seeker.stateId": { $arrayElemAt: ["$seekerDetails.stateId", 0] },
          "seeker.stateName": {
            $arrayElemAt: ["$seekerDetails.stateName", 0],
          },
          "seeker.talukId": {
            $arrayElemAt: ["$seekerDetails.talukId", 0],
          },
          "seeker.talukName": {
            $arrayElemAt: ["$seekerDetails.talukName", 0],
          },
        },
      },

      {
        $project: {
          seekerDetails: 0,
        },
      },
      {
        $match: {
          $or: [
            { cropName: { $regex: searchQuery, $options: "i" } },
            { farmName: { $regex: searchQuery, $options: "i" } },
            { "employeer.name": { $regex: searchQuery, $options: "i" } },
            { "employeer.address": { $regex: searchQuery, $options: "i" } },
          ],
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
    ]);

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getMyJobs(req, res) {
  try {
    const userId = req.params.userId;

    const jobs = await Job.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "result",
        },
      },

      {
        $addFields: { employeer: { $first: "$result" } },
      },
      {
        $project: {
          result: 0,

          "employeer.password": 0,
          "employeer.accessToken": 0,
          "employeer.refreshToken": 0,
          "employeer.createdAt": 0,
          "employeer.updatedAt": 0,
          "employeer.__v": 0,
          "employeer.profileImg": 0,
          "employeer.email": 0,
          "employeer.status": 0,
        },
      },
      {
        $lookup: {
          from: "jobseekers",
          localField: "_id",
          foreignField: "jobId",
          as: "seekers",
        },
      },
      {
        $unwind: {
          path: "$seekers",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "seekers.userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $addFields: {
          "seekers.userName": { $arrayElemAt: ["$userDetails.name", 0] },
          "seekers.email": { $arrayElemAt: ["$userDetails.email", 0] },
          "seekers.address": { $arrayElemAt: ["$userDetails.address", 0] },

          "seekers.districtId": {
            $arrayElemAt: ["$userDetails.districtId", 0],
          },
          "seekers.districtName": {
            $arrayElemAt: ["$userDetails.districtName", 0],
          },
          "seekers.phoneNumber": {
            $arrayElemAt: ["$userDetails.phoneNumber", 0],
          },
          "seekers.pinCode": { $arrayElemAt: ["$userDetails.pinCode", 0] },
          "seekers.place": { $arrayElemAt: ["$userDetails.place", 0] },
          "seekers.stateId": { $arrayElemAt: ["$userDetails.stateId", 0] },
          "seekers.stateName": {
            $arrayElemAt: ["$userDetails.stateName", 0],
          },
          "seekers.talukId": {
            $arrayElemAt: ["$userDetails.talukId", 0],
          },
          "seekers.talukName": {
            $arrayElemAt: ["$userDetails.talukName", 0],
          },
          "seekers.gender": {
            $arrayElemAt: ["$userDetails.gender", 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          cropName: { $first: "$cropName" },
          cropId: { $first: "$cropId" },
          farmName: { $first: "$farmName" },
          availMale: { $first: "$maleCount" },
          availFemale: { $first: "$femaleCount" },
          farmId: { $first: "$farmId" },
          image: { $first: "$image" },
          status: { $first: "$status" },
          distance: { $first: "$distance" },
          maleCount: { $first: "$maleCount" },
          femaleCount: { $first: "$femaleCount" },
          maleSalary: { $first: "$maleSalary" },
          femaleSalary: { $first: "$femaleSalary" },
          extra: { $first: "$extra" },
          fromDate: { $first: "$fromDate" },
          toDate: { $first: "$toDate" },
          duration: { $first: "$duration" },
          employeer: { $first: "$employeer" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          jobSeekers: { $push: "$seekers" },
          otherFacilities: { $first: "$otherFacilities" },
          jobDescription: { $first: "$jobDescription" },
        },
      },

      {
        $project: {
          userDetails: 0,
        },
      },

      {
        $sort: { updatedAt: -1 },
      },
    ]);

    const transformedData = jobs.map((item) => {
      const male = item.jobSeekers.filter(
        (jobSeeker) => jobSeeker.gender === 0 && jobSeeker.jobStatus === 2
      ).length;
      const female = item.jobSeekers.filter(
        (jobSeeker) => jobSeeker.gender === 1 && jobSeeker.jobStatus === 2
      ).length;

      const adjustedMaleCount = item.maleCount - male;
      const adjustedFemaleCount = item.femaleCount - female;

      const filteredJobSeekers = item.jobSeekers.filter(
        (seeker) => Object.keys(seeker).length > 0
      );

      return {
        ...item,
        availMale: adjustedMaleCount,
        availFemale: adjustedFemaleCount,
        jobSeekers: filteredJobSeekers,
      };
    });

    res.status(200).json(transformedData);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}
async function deleteJob(req, res) {
  try {
    const id = req.params.id;

    const deletedData = await Job.findByIdAndUpdate(
      id,
      {
        $set: { status: 1 },
      },
      { new: true }
    );

    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function updateJob(req, res) {
  try {
    const id = req.params.id;

    const updateFields = req.body;
    const result = await Job.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Data updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteDBJob(req, res) {
  const id = req.params.id;
  try {
    const result = await Job.findByIdAndDelete(id);

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
module.exports = {
  createJob,
  getAllJobs,
  deleteJob,
  updateJob,
  getMyJobs,
  getJobs,
  deleteDBJob,
};
/** {
        $lookup: {
          from: "cropcalendars",
          localField: "_id",
          foreignField: "JobId",
          as: "cropCalendars",
        },
      },
      {
        $unwind: {
          path: "$cropCalendars",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "cropmasters",
          localField: "cropCalendars.cropId",
          foreignField: "_id",
          as: "cropCalendars.cropDetails",
        },
      },
      {
        $unwind: {
          path: "$cropCalendars.cropDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          acre: { $first: "$acre" },
          soil: { $first: "$soil" },

          userId: { $first: "$userId" },
          latLong: { $first: "$latLong" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          crops: {
            $push: {
              _id: "$cropCalendars._id",
              cropName: "$cropCalendars.cropDetails.crop",
              cropType: "$cropCalendars.cropDetails.cropType",
              image: "$cropCalendars.cropDetails.image",
              sowDate: "$cropCalendars.sowDate",
              acreCultivated: "$cropCalendars.acreCultivated",
              description: "$cropCalendars.description",
              season: "$cropCalendars.season",
              cropAge: "$cropCalendars.cropAge",
              createdAt: "$cropCalendars.createdAt",
              updatedAt: "$cropCalendars.updatedAt",
            },
          },
        },
      },
      {
        $addFields: {
          crops: {
            $cond: {
              if: { $eq: ["$crops", [{}]] },
              then: [],
              else: "$crops",
            },
          },
        },
      }, */
