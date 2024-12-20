import Post from '../models/post.model';

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: { $in: req.user.connections },
    })
      .populate('author', 'name username profilePicture headline')
      .populate('comments.user', 'name username profilePicture headline')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.log(`🚀CHECK > error (getFeedPosts):`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
