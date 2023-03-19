import Event from '../models/Event.js';
import Member from '../models/Member.js';
import PresentBook from '../models/PresentBook.js';
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
  const { page = 0, limit = 0, sort = '', ...query } = req.query;
  const queries = {};
  if (query.type) queries.type = query.type;
  if (query.created_at) {
    let tomorrow;
    tomorrow = new Date(query.created_at);
    tomorrow.setDate(tomorrow.getDate() + 1);
    queries.created_at = { $gte: new Date(query.created_at), $lt: tomorrow };
  }

  try {
    let data = await Event.find(queries).exec();

    const rows = data.length;
    const allPage = Math.ceil(rows ? rows / (limit || rows) : 0);

    data = await Event.find(queries)
      .select('-__v')
      .sort(sort)
      .skip(page * limit)
      .limit(limit || rows)
      .exec();

    res.json({ data, page: Number(page), limit: Number(limit), rows, allPage });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

export const getEventById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const data = await Event.findOne({ _id }).select('-__v').exec();

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
    ).exec();

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
  const { type } = req.body;

  try {
    const event = await Event.findOneAndUpdate({ _id }, { status: 0 }).exec();

    const attendMember = await PresentBook.find({ event: _id }).exec();
    const members = [];

    for (const present of attendMember) {
      members.push(present.member);
    }

    if (event.type === 'dzikiran') {
      await Member.updateMany(
        { _id: { $nin: members } },
        { $push: { [type]: _id } }
      ).exec();

      await Member.updateMany(
        {
          _id: { $nin: members },
          $or: [{ $where: 'this.absent_kematian.length>2' }, { status: 0 }],
        },
        { $set: { attend_dzikiran: [] } }
      ).exec();
    } else if (event.type === 'kematian') {
      await Member.updateMany(
        { _id: { $nin: members }, status: 1, $where: 'this.absent_kematian.length<3' },
        { $push: { [type]: _id } }
      ).exec();
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const deleteEventById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await Event.deleteOne({ _id }).exec();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};
