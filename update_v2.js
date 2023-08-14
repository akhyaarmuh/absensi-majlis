import 'dotenv/config';
import './config/database.js';
import Member from './models/Member.js';
import Event from './models/Event.js';

const [lastEvent, secondEvent, thirdEvent] = await Event.find({ type: 'kematian' })
  .select('_id')
  .sort('-created_at');

// perbaiki yang absen kematian 1, 2, 3 kali bukan event terakhir
await Member.updateMany(
  {
    $where: 'this.absent_kematian.length>0',
    'absent_kematian.event_id': { $ne: lastEvent._id },
  },
  {
    $set: { absent_kematian: [] },
  }
);

// perbaiki yang absen kematian 2 kali, dan tidak bertururt-turut
await Member.updateMany(
  {
    absent_kematian: { $size: 2 },
    'absent_kematian.event_id': { $ne: secondEvent._id },
  },
  {
    $set: { absent_kematian: [] },
  }
);

// perbaiki yang absen kematian 3 kali, dan tidak bertururt-turut
await Member.updateMany(
  {
    absent_kematian: { $size: 3 },
    $or: [
      { 'absent_kematian.event_id': { $ne: secondEvent._id } },
      { 'absent_kematian.event_id': { $ne: thirdEvent._id } },
    ],
  },
  {
    $set: { absent_kematian: [] },
  }
);

// selesai
console.log('Berhasil');
