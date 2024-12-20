import e from 'express';
import cloudinary from '../lib/cloudinary.js';
import Post from '../models/post.model.js';

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

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    let newPost;

    if (image) {
      const imageResult = await cloudinary.uploader.upload(image);

      newPost = new Post({
        author: req.user._id,
        content,
        image: imageResult.secure_url,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        content,
      });
    }

    // save post
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.log(`🚀CHECK > error (createPost):`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
