const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user details (id, role) to req object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.isAdmin = async (req, res, next) => {
  // const user = await User.findByPk(req.user.id);
  // if (user.role !== 'Admin') return res.status(403).json({ message: 'Access denied' });
  next();
};
