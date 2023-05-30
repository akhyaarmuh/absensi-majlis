import express from 'express';
import { createPresent } from '../controllers/attendanceBook.js';

const route = express.Router();

route.post('/', createPresent);

export default route;
