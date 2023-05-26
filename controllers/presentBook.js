import Member from '../models/Member.js';
import PresentBook from '../models/PresentBook.js';
import { formatterErrorValidation } from '../utilities/mongoose.js';

export const createPresent = async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/images`;
  const { no_induk, event, type } = req.body;
  const key = type === 'kematian' ? 'absent_kematian' : 'absent_dzikiran';
  const member = await Member.findOne({ no_induk }).populate('region').exec();

  try {
    if (!member) {
      throw {
        name: 'ValidationError',
        message: 'Anggota tidak ditemukan',
        errors: { member: { message: 'Anggota tidak ditemukan' } },
      };
    }

    if (type === 'kematian' && (member[key].length >= 3 || member.status === 0)) {
      throw {
        name: 'ValidationError',
        message: 'Kartu anda terblokir, hubungi operator',
        errors: { member: { message: 'Kartu anda terblokir, hubungi operator' } },
      };
    }

    const newPresent = new PresentBook({
      event,
      member: member._id,
    });
    await newPresent.save();

    if (
      type === 'dzikiran' &&
      (member.absent_kematian.length >= 3 || member.status === 0)
    ) {
      await Member.findOneAndUpdate(
        { no_induk },
        { $push: { attend_dzikiran: event } }
      ).exec();
    }

    member.set('image', member.image ? `${url}/${member.image}` : '');

    res.status(201).json({ data: member });
  } catch (error) {
    if (error.name === 'ValidationError')
      if (error.errors.member?.message === 'Anggota sudah berhasil absen')
        res.status(400).json({
          message: `"${member.full_name}" sudah berhasil absen`,
          error: formatterErrorValidation(error),
        });
      else
        res.status(400).json({
          message: error.errors.member?.message || error.message || 'Data tidak benar',
          error: formatterErrorValidation(error),
        });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const getPresentBookByEvent = async (req, res) => {
  const { event } = req.params;
  const { page = 0, limit = 0, sort = '' } = req.query;

  try {
    let data = await PresentBook.find({ event }).exec();

    const rows = data.length;
    const allPage = Math.ceil(rows ? rows / (limit || rows) : 0);

    data = await PresentBook.find({ event })
      .select('member')
      .populate({ path: 'member', populate: { path: 'region', select: 'name' } })
      .sort(sort)
      .skip(page * limit)
      .limit(limit || rows)
      .exec();

    res.json({ data, page: Number(page), limit: Number(limit), rows, allPage });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};
