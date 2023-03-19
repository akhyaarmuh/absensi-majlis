import express from 'express';
import {
  createEvent,
  getAllEvent,
  getEventById,
  updateEventById,
  updateStatusById,
  deleteEventById,
} from '../controllers/event.js';
import { verifyAccessToken } from '../middlewares/index.js';

const route = express.Router();

route.post('/', verifyAccessToken, createEvent);
route.get('/', verifyAccessToken, getAllEvent);
route.get('/:id', verifyAccessToken, getEventById);
route.patch('/:id', verifyAccessToken, updateEventById);
route.patch('/:id/status', verifyAccessToken, updateStatusById);
route.delete('/:id', verifyAccessToken, deleteEventById);

export default route;
