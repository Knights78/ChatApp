const jwt = require('jsonwebtoken');
const userModel = require('../models/User');
const refreshToken = require('./refreshToken');

const getUserDetailsFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.id).select('-password');
    return user;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const newToken = await refreshToken(token);
      if (newToken) {
        return getUserDetailsFromToken(newToken);
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
};

module.exports = getUserDetailsFromToken;