import express from 'express';
import {
  createRegion,
  getAllRegion,
  getRegionById,
  updateRegionById,
  deleteRegionById,
} from '../controllers/region.js';
import { verifyAccessToken } from '../middlewares/index.js';

const route = express.Router();

route.post('/', verifyAccessToken, createRegion);
route.get('/', verifyAccessToken, getAllRegion);
route.get('/:id', verifyAccessToken, getRegionById);
route.patch('/:id', verifyAccessToken, updateRegionById);
route.delete('/:id', verifyAccessToken, deleteRegionById);

export default route;
