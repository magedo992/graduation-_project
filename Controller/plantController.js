const Plant = require('../models/plant');


exports.getAllPlants = asyncHandler(async (req, res) => {
    const plants = await Plant.find();
    res.json(plants);
  });


exports.getPlantById = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json(plant);
});


exports.addPlant = asyncHandler(async (req, res) => {
  const plant = new Plant(req.body);
  const newPlant = await plant.save();
  res.status(201).json({message: 'New plant added'});
});

exports.updatePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json(plant);
});


exports.deletePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findByIdAndDelete(req.params.id);
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json({ message: 'Plant deleted' });
});