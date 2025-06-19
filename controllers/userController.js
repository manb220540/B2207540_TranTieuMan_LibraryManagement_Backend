// backend/controllers/userController.js
const DocGia = require('../models/DocGia');

// Get all readers for admin
exports.getUsers = async (req, res) => {
  try {
    const users = await DocGia.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};