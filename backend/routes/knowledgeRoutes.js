import express from 'express';
const router = express.Router();
import {
  getKnowledgePosts,
  getKnowledgePostById,
  createKnowledgePost,
  updateKnowledgePost,
  deleteKnowledgePost,
  createKnowledgeComment,
} from '../controllers/knowledgeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getKnowledgePosts).post(protect, admin, createKnowledgePost);
router.route('/:id/comments').post(protect, createKnowledgeComment);
router
  .route('/:id')
  .get(getKnowledgePostById)
  .put(protect, admin, updateKnowledgePost)
  .delete(protect, admin, deleteKnowledgePost);

export default router;
