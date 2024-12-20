import cloudinary from '../lib/cloudinary.js';
import User from '../models/user.model.js';

/* GET SUGGESTED CONNECTIONS */
export const getSuggestedConnections = async () => {
  try {
    // Get current user
    const currentUser = await User.findById(req.user._id).select('connections');

    // Find 3 users who are not connected to current User
    const suggestUsers = await User.find({
      _id: {
        $ne: req.user._id,
        $nin: currentUser.connections,
      },
    })
      .select('name username profilePicture headline')
      .limit(3);

    res.status(200).json(suggestUsers);
  } catch (error) {
    console.log(`🚀CHECK > error:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/* GET PUBLIC PROFILE */
export const getPublicProfile = async () => {
  try {
    const user = await User.findOne({
      username: req.user.username,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(`🚀CHECK > error:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/* UPDATE PROFILE */
export const updateProfile = async (req, res) => {
  try {
    // Prepare data
    const allowedFields = [
      'name',
      'username',
      'headline',
      'about',
      'location',
      'profilePicture',
      'bannerImg',
      'skills',
      'experience',
      'education',
    ];

    const updateData = {};

    // Check req.body contain any allowed fields, add to updateData
    for (const field of allowedFields) {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    }

    // Check profilePicture, bannerImg => Upload to cloundinary
    if (req.body.profilePicture) {
      const result = await cloudinary.uploader.upload(req.body.profilePicture);
      updateData.profilePicture = result.secure_url;
    }

    if (req.body.bannerImg) {
      const result = await cloudinary.uploader.upload(req.body.bannerImg);
      updateData.bannerImg = result.secure_url;
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      {
        new: true,
      },
    ).select('-password');

    // Return user back to client
    res.json(user);
  } catch (error) {
    console.log(`🚀CHECK > error:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
