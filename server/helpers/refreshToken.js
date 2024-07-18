const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.id).select('-password');
    const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h', // adjust the expiration time as needed
    });
    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

module.exports = refreshToken;