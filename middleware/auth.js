const jwt = require('jsonwebtoken');

// JWT Validation Middleware
const auth = async (req, res, next) => {
  try {
    console.log('Auth Middleware - Headers:', req.headers);
    console.log('Auth Middleware - Cookies:', req.cookies);
    console.log('Auth Middleware - Raw Cookie:', req.headers.cookie);

    const token = req.cookies.accessToken;
    console.log('Auth Middleware - Token:', token);

    if (!token) {
      console.log('Auth Middleware - No token found');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware - Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth Middleware - Error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
