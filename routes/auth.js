import express from 'express';
import { verifyAccessToken } from '../middlewares/index.js';
import {
  register,
  login,
  verifyPassword,
  refreshToken,
  resetPassword,
  logout,
} from '../controllers/auth.js';

const route = express.Router();

route.post('/register', register);
route.post('/login', login);
route.post('/verify-password', verifyAccessToken, verifyPassword);
route.get('/refresh-token', refreshToken);
route.patch('/reset-password', resetPassword);
route.delete('/logout', verifyAccessToken, logout);

export default route;
