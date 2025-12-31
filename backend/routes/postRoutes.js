const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', postController.getAllPosts);

router.get('/:id', postController.getPostById);

router.post('/', authenticate, postController.createPost);

router.put('/:id', authenticate, authorize, postController.updatePost);

router.delete('/:id', authenticate, authorize, postController.deletePost);

module.exports = router;

