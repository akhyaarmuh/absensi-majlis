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

  try {
    const event = await Event.findOneAndUpdate({ _id }, { status: 0 });

    const attendanceMembers = await Attendance_Book.find({ event_id: _id });

    const attendance_ids = [];
    for (const member of attendanceMembers) {
      attendance_ids.push(member.member_id);
    }

    let absentMembers;

    if (event.type === 'dzikiran') {
      // masukan absen hadir ke member yang belum aktif atau absen kematian 3 kali
      await Member.updateMany(
        {
          _id: { $in: attendance_ids },
          $or: [{ status: 0 }, { $where: 'this.absent_kematian.length>2' }],
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

      // untuk yang tidak hadir dalam keadaan status belum aktif atau absen kematian lebih 3 kali maka reset attandance_dzikiran
      await Member.updateMany(
        {
          _id: { $nin: attendance_ids },
          $or: [{ status: 0 }, { $where: 'this.absent_kematian.length>2' }],
        },
        { $set: { attendance_dzikiran: [] } }
      );

      absentMembers = await Member.find({ _id: { $nin: attendance_ids } });
    } else if (event.type === 'kematian') {
      // ambil siapa saja yang tidak hadir
      absentMembers = await Member.find({
        _id: { $nin: attendance_ids },
        status: 1,
        $where: 'this.absent_kematian.length<3',
      });

      // masukan absen ke member yang aktif atau absen kematian dibawah 3 kali
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
    }

    const absent_ids = [];
    for (const member of absentMembers) {
      absent_ids.push(member._id);
    }

    await Event.findOneAndUpdate(
      { _id },
      { attendance: attendance_ids.length, absent: absent_ids }
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
