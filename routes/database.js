import express from 'express';
import { verifyAccessToken } from '../middlewares/index.js';
import { restore } from '../controllers/database.js';

const route = express.Router();

route.post('/', verifyAccessToken, restore);

export default route;
