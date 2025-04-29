const jwt = require('jsonwebtoken');

// JWT Validation Middleware
module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  console.log('Token:', token);
  console.log('Extracted Token:', token);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
