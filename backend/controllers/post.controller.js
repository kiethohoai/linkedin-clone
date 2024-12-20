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

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post Not Found' });
    }

    // Check if user is author of this post
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'Failed to delete post! You are not author of this post',
      });
    }

    // Delete image from cloudinary (input is id of image in cloudinary)
    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split('/').pop().split('.')[0],
      );
    }

    // Delete post
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log(`🚀CHECK > error (deletePost):`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
