import express from 'express';
import {
  createRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all request-flow routes

router.route('/')
  .post(createRequest)
  .get(getRequests);

router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/cancel', cancelRequest);

export default router;
