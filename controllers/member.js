import fs from 'fs';
import path from 'path';
import Member from '../models/Member.js';
import { __dirname } from '../utilities/index.js';
import { formatterErrorValidation } from '../utilities/mongoose.js';

const allowedType = ['.png', '.jpg', '.jpeg'];

export const createMember = async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();

    res.status(201).json({ data: newMember, message: 'Member berhasil dibuat' });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: formatterErrorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const getAllMember = async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/images`;
  const { page = 0, limit = 0, sort = 'region full_name', ...query } = req.query;
  const queries = {};
  if (query.no_induk) queries.no_induk = query.no_induk;
  if (query.full_name) queries.full_name = new RegExp(query.full_name, 'i');
  if (query.region) queries.region = query.region;
  if (query.status) {
    if (query.status === 'new') queries.status = 0;
    else if (query.status === 'inactive')
      queries.$or = [
        { absent_dzikiran: { $size: 3 } },
        { absent_kematian: { $size: 3 } },
      ];
  }

  try {
    const rows = await Member.countDocuments(queries);
    const allPage = !rows ? 0 : !limit ? 1 : Math.ceil(rows / limit);

    const data = await Member.find(queries)
      .select('-__v')
      .populate('region', 'name')
      .sort(sort)
      .skip(page * limit)
      .limit(limit || rows);

    res.json({ data, page: Number(page), limit: Number(limit), rows, allPage, url });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

export const getMemberById = async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/images`;
  const { id: _id } = req.params;

  try {
    const data = await Member.findOne({ _id }).select('-__v').populate('region', 'name');

    const member = data;
    member.url = url;

    res.json({ member });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

export const updateMemberById = async (req, res) => {
  const { id: _id } = req.params;
  const payload = req.body;

  try {
    await Member.findOneAndUpdate(
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
    const member = await Member.findOne({ _id });

    await Member.findOneAndUpdate({ _id }, { status: member.status ? 0 : 1 });

    res.sendStatus(204);
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: formatterErrorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const updateAbsentById = async (req, res) => {
  const { id: _id } = req.params;
  const { type } = req.body;

  try {
    if (type === 'kematian') {
      await Member.findOneAndUpdate(
        { _id },
        {
          $set: {
            attendance_dzikiran: [],
            absent_kematian: [],
          },
        }
      );
    } else if (type === 'dzikiran') {
      await Member.findOneAndUpdate(
        { _id },
        {
          $set: {
            attendance_dzikiran: [],
            absent_dzikiran: [],
          },
        }
      );
    }

    res.sendStatus(204);
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: formatterErrorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const deleteMemberById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await Member.deleteOne({ _id });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// support
export const uploadImage = async (req, res) => {
  const image = req.files?.image;
  const { id: _id } = req.params;

  try {
    const ext = path.extname(image.name);
    if (!image)
      throw {
        name: 'ValidationError',
        message: 'Gambar tidak valid',
        errors: { image: 'Gambar tidak boleh kosong' },
      };

    if (!allowedType.includes(ext.toLowerCase()))
      // cek extensi yang diizinkan
      throw {
        name: 'ValidationError',
        message: 'Gambar tidak valid',
        errors: { image: 'File yang diizinkan (.png, .jpg, .jpeg)' },
      };

    // cek ukuran gambar
    if (image.size > 3000000)
      throw {
        name: 'ValidationError',
        message: 'Gambar tidak valid',
        errors: { image: 'File terlalu besar (Maksimal 3 MB)' },
      };

    const fileName = new Date().getTime() + ext;

    image.mv(`${__dirname}/public/images/${fileName}`, async (error) => {
      if (error) throw error;

      const oldMember = await Member.findOne({ _id });
      await Member.findOneAndUpdate({ _id }, { image: fileName });

      if (oldMember.image) fs.unlinkSync(`${__dirname}/public/images/${oldMember.image}`);
    });

    res.json({ fileName });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Gambar tidak valid',
        error: error.errors,
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const deleteImage = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const member = await Member.findOne({ _id });

    if (member.image) fs.unlinkSync(`${__dirname}/public/images/${member.image}`);

    await Member.findByIdAndUpdate({ _id }, { image: '' });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};
