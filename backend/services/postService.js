const Post = require('../models/Post');

const getAllPosts = async () => {
  const posts = await Post.find()
    .populate('authorId', 'name email')
    .sort({ createdAt: -1 });

  return posts;
};

const getPostById = async (postId) => {
  const post = await Post.findById(postId).populate('authorId', 'name email');

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
};

const createPost = async (postData, authorId) => {
  const { title, content } = postData;

  const post = await Post.create({
    title,
    content,
    authorId,
  });

  await post.populate('authorId', 'name email');

  return post;
};

const updatePost = async (postId, updateData) => {
  const { title, content } = updateData;

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      title,
      content,
    },
    {
      new: true, 
      runValidators: true, 
    }
  ).populate('authorId', 'name email');

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
};

const deletePost = async (postId) => {
  const post = await Post.findByIdAndDelete(postId);

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

