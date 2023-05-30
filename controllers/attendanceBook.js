import Member from '../models/Member.js';
import Attendance_Book from '../models/Attendance_Book.js';
import { formatterErrorValidation } from '../utilities/mongoose.js';

export const createPresent = async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/images`;
  const { no_induk, event_id, type } = req.body;
  const member = await Member.findOne({ no_induk }).populate('region', 'name');

  try {
    if (!member) {
      throw {
        name: 'ValidationError',
        message: 'Anggota tidak ditemukan',
        errors: { member: { message: 'Anggota tidak ditemukan' } },
      };
    }

    if (
      type === 'kematian' &&
      (member.absent_kematian.length >= 3 || member.status === 0)
    ) {
      throw {
        name: 'ValidationError',
        message: 'Kartu anda terblokir, hubungi operator',
        errors: { member: { message: 'Kartu anda terblokir, hubungi operator' } },
      };
    }

    const newAttendanceBook = new Attendance_Book({
      event_id,
      member_id: member._id,
    });
    await newAttendanceBook.save();

    member.set('image', member.image ? `${url}/${member.image}` : '');
    res.status(201).json({ data: member });
  } catch (error) {
    if (error.code === 11000)
      res.status(400).json({
        message: `"${member.full_name}" sudah berhasil absen`,
        error: formatterErrorValidation(error),
      });
    else if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.errors.member?.message || error.message || 'Data tidak benar',
        error: formatterErrorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};
