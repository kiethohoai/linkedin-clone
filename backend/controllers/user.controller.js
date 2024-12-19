import User from '../models/user.model';

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
