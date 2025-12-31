const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const register = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    token,
  };

  return userResponse;
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    token,
  };

  return userResponse;
};

module.exports = {
  register,
  login,
};

