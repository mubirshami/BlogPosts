const Post = require('../models/Post');

const authorize = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action',
      });
    }

    req.post = post;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking authorization',
    });
  }
};

module.exports = authorize;

