import 'dotenv/config';
import './config/database.js';
import Member from './models/Member.js';

// update semua member
await Member.updateMany({ absent_dzikiran: [] });

console.log('Berhasil');
