const express = require("express");
const router = express.Router();
const Village = require("../models/Village");

// POST /api/villages
router.post("/", async (req, res) => {
  try {
    const newVillage = new Village({
      name: req.body.name,
      description: req.body.description,
      // images will be added by the upload middleware in index.js
      location: {
        type: "Point",
        coordinates: req.body.coordinates || [0, 0]
      }
    });
    
    await newVillage.save();
    res.status(201).json(newVillage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving village." });
  }
});

module.exports = router;