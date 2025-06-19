// backend/controllers/publisherController.js
const NhaXuatBan = require('../models/NhaXuatBan');

// Get all publishers with optional search
exports.getPublishers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { TenNXB: new RegExp(search, 'i') } : {};
    const publishers = await NhaXuatBan.find(query);
    res.json(publishers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};