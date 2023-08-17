import 'dotenv/config';
import './config/database.js';
import Member from './models/Member.js';

// cari semua member
const members = await Member.find();

for (const member of members) {
  await Member.findByIdAndUpdate({ _id: member._id }, { absent_dzikiran: [] });
}

console.log('Berhasil');
