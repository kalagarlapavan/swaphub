import express from 'express';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

export default router;
