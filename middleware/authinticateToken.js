
import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
    console.log(req.body);
  const token = req.body.token; // Expecting 'Bearer <token>'

  if (!token) {
    console.log('token not found')
    return res.status(401).json({ status: false, message: "Access Denied. No token provided." });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'your_secret_key';
    const decoded = jwt.verify(token, secretKey); // Verifies the token
    req.JsonUserInfo = decoded; // Attach decoded user info to the request object
    next(); // Proceed to the next middleware or route
  } catch (err) {
    return res.status(403).json({ status: false, message: "Invalid or expired token." });
  }
}

export default authenticateJWT;
