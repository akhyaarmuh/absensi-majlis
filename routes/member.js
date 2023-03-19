import express from 'express';
import {
  createMember,
  getAllMember,
  getMemberById,
  updateMemberById,
  updateStatusById,
  updateAbsentById,
  deleteMemberById,
  uploadImage,
  deleteImage,
} from '../controllers/member.js';
import { verifyAccessToken } from '../middlewares/index.js';

const route = express.Router();

route.post('/', verifyAccessToken, createMember);
route.post('/:id/image', verifyAccessToken, uploadImage);
route.get('/', verifyAccessToken, getAllMember);
route.get('/:id', verifyAccessToken, getMemberById);
route.patch('/:id', verifyAccessToken, updateMemberById);
route.patch('/:id/status', verifyAccessToken, updateStatusById);
route.patch('/:id/absent', verifyAccessToken, updateAbsentById);
route.delete('/:id', verifyAccessToken, deleteMemberById);
route.delete('/:id/image', verifyAccessToken, deleteImage);

export default route;
