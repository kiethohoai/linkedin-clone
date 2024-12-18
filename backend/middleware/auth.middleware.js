import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    // Get & check token if exists
    const token = req.cookies['jwt-linkedin'];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized! No Token Provided' });
    }

    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: 'Unauthorized! Invalid Token' });
    }

    // Get userId & assign to req
    const userId = decode.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // Everything ok, assign user to req, call next
    req.user = user;
    next();
  } catch (error) {
    console.log(`🚀error (protectRoute):`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
