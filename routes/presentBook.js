import express from 'express';
import { createPresent, getPresentBookByEvent } from '../controllers/presentBook.js';
import { verifyAccessToken } from '../middlewares/index.js';

const route = express.Router();

route.post('/', verifyAccessToken, createPresent);
route.get('/:event', verifyAccessToken, getPresentBookByEvent);

export default route;
