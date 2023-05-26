import 'dotenv/config';
import './config/database.js';
import Member from './models/Member.js';

await Member.updateMany({}, { status: 1 });

console.log('Berhasil');
