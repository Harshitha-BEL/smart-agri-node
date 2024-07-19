const state = require("../../model/others/states");
const district = require("../../model/others/districts");
const taluk = require("../../model/others/taluks");
const mongoose = require("mongoose");
async function saveStates(req, res) {
  try {
    const states = req.body;

    const stateDocs = states.map((element) => new state({ name: element }));

    await state.insertMany(stateDocs);

    res.status(200).send({ message: "States saved successfully!" });
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getStates(req, res) {
  try {
    const result = await state.find();

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(204).send(); // No Content
    }
  } catch (e) {
    res.status(500).json(e);
  }
}

async function saveDistrict(req, res) {
  try {
    const districts = req.body.districts;
    const parentId = req.body.stateId;
    const districtDocs = districts.map(
      (element) => new district({ name: element, parentId: parentId })
    );

    await district.insertMany(districtDocs);

    res.status(200).send({ message: "Districts saved successfully!" });
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getDistrict(req, res) {
  try {
    const parentId = new mongoose.Types.ObjectId(req.params.id);
    const result = await district.find({ parentId: parentId });

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(204).send(); // No Content
    }
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getAllDistricts(req, res) {
  try {
    const result = await district.find();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}

async function saveTaluk(req, res) {
  try {
    const taluks = req.body.taluks;
    const parentId = req.body.districtId;
    const talukDocs = taluks.map(
      (element) => new taluk({ name: element, parentId: parentId })
    );

    await taluk.insertMany(talukDocs);

    res.status(200).send({ message: "Taluks saved successfully!" });
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getTaluk(req, res) {
  try {
    const parentId = new mongoose.Types.ObjectId(req.params.id);
    const result = await taluk.find({ parentId: parentId });

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(204).send(); // No Content
    }
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getAllTaluks(req, res) {
  try {
    const result = await taluk.find();

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}

module.exports = {
  saveStates,
  getStates,
  saveDistrict,
  getDistrict,
  saveTaluk,
  getTaluk,
  getAllDistricts,
  getAllTaluks,
};
