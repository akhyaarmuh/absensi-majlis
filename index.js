import 'dotenv/config';
import ip from 'ip';
import open from 'open';
import path from 'path';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import './config/database.js';
import { __dirname } from './utilities/index.js';

import authRoute from './routes/auth.js';
import databaseRoute from './routes/database.js';
import userRoute from './routes/user.js';
import regionRoute from './routes/region.js';
import memberRoute from './routes/member.js';
import eventRoute from './routes/event.js';
import presentBookRoute from './routes/presentBook.js';

const app = express();
const api = process.env.API_VERSION;
const port = process.env.PORT || 5050;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

app.use(`/${api}/auth`, authRoute);
app.use(`/${api}/database`, databaseRoute);
app.use(`/${api}/user`, userRoute);
app.use(`/${api}/region`, regionRoute);
app.use(`/${api}/member`, memberRoute);
app.use(`/${api}/event`, eventRoute);
app.use(`/${api}/present-book`, presentBookRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(process.env.PORT, () => {
  console.log('Server running on: http://localhost:' + process.env.PORT);
  open(`http://localhost:${process.env.PORT}`, { app: 'chrome' });
});

app.listen(process.env.PORT, ip.address(), () => {
  console.log(`Server running on: http://${ip.address()}:${process.env.PORT}`);
  console.log('App started');
});
