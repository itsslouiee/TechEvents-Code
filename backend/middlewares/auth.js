// we call this middleware in protected routes 
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the token exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    //Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //decoded has the id & role of user
    req.user = decoded;

    next();

  } catch (error) {
    // If the token is invalid, return an error
    res.status(401).json({ error: 'Invalid token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

const verifyOrganizer = (req, res, next) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Access denied. Only organizers allowed.' });
  }
  next();
};

module.exports = {verifyToken, verifyAdmin, verifyOrganizer};