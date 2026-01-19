const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// POST /add - Create a new hospital
router.post('/add', async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json(hospital);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /heatmap-data - Return hospital data from MongoDB
router.get('/heatmap-data', async (req, res) => {
  console.log('Hit: Heatmap Data Endpoint');
  
  try {
    const hospitals = await Hospital.find({});
    const heatmapData = hospitals.map(hospital => ({
      lat: hospital.location.lat,
      lng: hospital.location.lng,
      intensity: hospital.occupiedBeds / hospital.totalBeds
    }));
    
    res.json(heatmapData);
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
});

// GET /inventory/:id - Fetch specific hospital's inventory
router.get('/inventory/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    
    res.json({
      hospitalName: hospital.name,
      inventory: hospital.inventory || []
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

module.exports = router;
