import Event from '../models/Event.js';
import Member from '../models/Member.js';
import Attendance_Book from '../models/Attendance_Book.js';
import { formatterErrorValidation } from '../utilities/mongoose.js';

export const createEvent = async (req, res) => {
  const payload = req.body;

  try {
    const newEvent = new Event(payload);
    await newEvent.save();

    res.status(201).json({ data: newEvent, message: 'Acara berhasil dibuat' });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: formatterErrorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const getAllEvent = async (req, res) => {
  const { page = 0, limit = 0, sort = '-created_at' } = req.query;
  const queries = {};

  try {
    const rows = await Event.countDocuments(queries);
    const allPage = !rows ? 0 : !limit ? 1 : Math.ceil(rows / limit);

    const data = await Event.find(queries)
      .populate({
        path: 'absent',
        populate: { path: 'region' },
        options: {
          sort: { region: 'asc', full_name: 'asc' },
        },
      })
      .select('-__v')
      .sort(sort)
      .skip(page * limit)
      .limit(limit || rows);

    res.json({ data, page: Number(page), limit: Number(limit), rows, allPage });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

export const getEventById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const data = await Event.findOne({ _id })
      .populate({
        path: 'absent',
        populate: { path: 'region' },
        options: {
          sort: { region: 'asc', full_name: 'asc' },
        },
      })
      .select('-__v');

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

export const updateEventById = async (req, res) => {
  const { id: _id } = req.params;
  const payload = req.body;

  try {
    await Event.findOneAndUpdate(
      { _id },
      { ...payload, _id },
      {
        runValidators: true,
      }
    );

    res.json({ data: payload });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: formatterErrorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const updateStatusById = async (req, res) => {
  const { id: _id } = req.params;

  let absentMembers;
  const absent_ids = [];
  const attendance_ids = [];

  try {
    // ambil event
    const event = await Event.findOne({ _id });

    // ambil semua anggota yang hadir
    const attendanceMembers = await Attendance_Book.find({ event_id: _id });

    // masukkan semua ID member yang hadir ke attendance_ids
    for (const member of attendanceMembers) {
      attendance_ids.push(member.member_id);
    }

    if (event.type === 'dzikiran') {
      // masukan data hadir ke member yang belum aktif, absen kematian >= 3 kali atau absen dzikiran >= 3 kali
      await Member.updateMany(
        {
          _id: { $in: attendance_ids },
          $or: [
            { status: 0 },
            { $where: 'this.absent_kematian.length>2' },
            { $where: 'this.absent_dzikiran.length>2' },
          ],
        },
        {
          $push: {
            attendance_dzikiran: {
              event_id: _id,
              name: event.name,
              date: event.created_at,
            },
          },
        }
      );

      // bagi yang hadir dalam keadaan absent_dzikiran kurang 3 kali maka reset absent_dzikiran
      await Member.updateMany(
        {
          _id: { $in: attendance_ids },
          $where: 'this.absent_dzikiran.length<3',
        },
        {
          $set: { absent_dzikiran: [] },
        }
      );

      // bagi yang tidak hadir dalam keadaan status belum aktif, absen kematian lebih 3 kali atau absen dzikiran lebih 3 kali maka reset attandance_dzikiran
      await Member.updateMany(
        {
          _id: { $nin: attendance_ids },
          $or: [
            { status: 0 },
            { $where: 'this.absent_kematian.length>2' },
            { $where: 'this.absent_dzikiran.length>2' },
          ],
        },
        { $set: { attendance_dzikiran: [] } }
      );

      // masukan absen ke member yang tidak hadir dzikiran dibawah 3 kali
      await Member.updateMany(
        {
          _id: { $nin: attendance_ids },
          status: 1,
          $where: 'this.absent_dzikiran.length<3',
        },
        {
          $push: {
            absent_dzikiran: {
              event_id: _id,
              name: event.name,
              date: event.created_at,
            },
          },
        }
      );

      absentMembers = await Member.find({ _id: { $nin: attendance_ids } });
    } else if (event.type === 'kematian') {
      // bagi yang hadir dalam keadaan absent_kematian kurang 3 kali maka reset absent_dzikiran
      await Member.updateMany(
        {
          _id: { $in: attendance_ids },
          $where: 'this.absent_kematian.length<3',
        },
        {
          $set: { absent_kematian: [] },
        }
      );

      // masukan absen ke member yang tidak hadir kematian dibawah 3 kali
      await Member.updateMany(
        {
          _id: { $nin: attendance_ids },
          status: 1,
          $where: 'this.absent_kematian.length<3',
        },
        {
          $push: {
            absent_kematian: {
              event_id: _id,
              name: event.name,
              date: event.created_at,
            },
          },
        }
      );

      absentMembers = await Member.find({
        _id: { $nin: attendance_ids },
        status: 1,
        $where: 'this.absent_kematian.length<3',
        $where: 'this.absent_dzikiran.length<3',
      });
    }

    for (const member of absentMembers) {
      absent_ids.push(member._id);
    }

    await Event.findOneAndUpdate(
      { _id },
      { attendance: attendance_ids.length, absent: absent_ids, status: 0 }
    );

    for (const attandance of attendanceMembers) {
      await Attendance_Book.deleteOne({ _id: attandance._id });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const deleteEventById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await Event.deleteOne({ _id });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};
