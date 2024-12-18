import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';

// SIGN UP
export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check email exist
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check username exist
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      username,
      email,
      password: hashPassword,
    });
    await user.save();

    // Create token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '3d',
      },
    );

    // Set cookie
    res.cookie('jwt-linkedin', token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Send back respone
    res.status(201).json({ message: 'User created successfully' });

    // profileUrl
    const profileUrl = `${process.env.CLIENT_URL}/profile/${user.username}`;

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name, profileUrl);
    } catch (emailErr) {
      console.error(`🚀Error while sending email:`, emailErr);
    }

    //
  } catch (error) {
    console.log(`🚀error (signup):`, error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check empty email & password
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Check password
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    // If everything is OK. Create Token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '3d',
      },
    );

    // Set cookie
    res.cookie('jwt-linkedin', token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({ message: 'User logged in successfully' });
  } catch (error) {
    console.log(`🚀error (login):`, error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// LOGOUT
export const logout = (req, res) => {
  // Set cookie
  res.cookie('jwt-linkedin', '');
  res.status(200).json({ message: 'Logged out successfully' });
};
