import asyncHandler from 'express-async-handler';
import Knowledge from '../models/knowledgeModel.js';

// @desc    Fetch all knowledge posts
// @route   GET /api/knowledge
// @access  Public
const getKnowledgePosts = asyncHandler(async (req, res) => {
  const posts = await Knowledge.find({});
  res.json(posts);
});

// @desc    Fetch single knowledge post
// @route   GET /api/knowledge/:id
// @access  Public
const getKnowledgePostById = asyncHandler(async (req, res) => {
  const post = await Knowledge.findById(req.params.id);

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Create a knowledge post
// @route   POST /api/knowledge
// @access  Private/Admin
const createKnowledgePost = asyncHandler(async (req, res) => {
  const post = new Knowledge({
    title: 'Sample Title',
    content: 'Sample Content',
    category: 'Crop Care',
    author: req.user.name || 'Agri Expert',
    image: '/images/sample.jpg',
    videoUrl: '',
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});

// @desc    Update a knowledge post
// @route   PUT /api/knowledge/:id
// @access  Private/Admin
const updateKnowledgePost = asyncHandler(async (req, res) => {
  const { title, content, category, author, image, videoUrl } = req.body;

  const post = await Knowledge.findById(req.params.id);

  if (post) {
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.author = author || post.author;
    post.image = image || post.image;
    post.videoUrl = videoUrl || post.videoUrl;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete a knowledge post
// @route   DELETE /api/knowledge/:id
// @access  Private/Admin
const deleteKnowledgePost = asyncHandler(async (req, res) => {
  const post = await Knowledge.findById(req.params.id);

  if (post) {
    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Create new comment
// @route   POST /api/knowledge/:id/comments
// @access  Private
const createKnowledgeComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const post = await Knowledge.findById(req.params.id);

  if (post) {
    const comment = {
      name: req.user.name,
      text,
      user: req.user._id,
    };

    post.comments.push(comment);

    await post.save();
    res.status(201).json({ message: 'Comment added' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

export {
  getKnowledgePosts,
  getKnowledgePostById,
  createKnowledgePost,
  updateKnowledgePost,
  deleteKnowledgePost,
  createKnowledgeComment,
};
