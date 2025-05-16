const { redisClient } = require('../config/redis');
const jwt = require('jsonwebtoken');

const checkTokenBlacklist = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Check if Redis client is connected
    if (!redisClient.isReady) {
      console.error('Redis client not connected');
      // Continue without blacklist check if Redis is down
      return next();
    }

    try {
      const isBlacklisted = await redisClient.get(`bl_${token}`);
      if (isBlacklisted) {
        return res.status(401).json({ message: 'Token has been revoked' });
      }
      next();
    } catch (redisError) {
      console.error('Redis error:', redisError);
      // Continue without blacklist check if Redis operation fails
      next();
    }
  } catch (error) {
    console.error('Token blacklist check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = checkTokenBlacklist;
