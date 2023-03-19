import Region from '../models/Region.js';
import { formatterErrorValidation } from '../utilities/mongoose.js';

export const createRegion = async (req, res) => {
  try {
    const newRegion = new Region(req.body);
    await newRegion.save();

    res.status(201).json({ data: newRegion, message: 'Wilayah berhasil dibuat' });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: formatterErrorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const getAllRegion = async (req, res) => {
  const { page = 0, limit = 0, sort = '', ...query } = req.query;
  const queries = {};
  if (query.name) queries.name = new RegExp(query.name, 'i');

  try {
    let data = await Region.find(queries).exec();
    const rows = data.length;
    const allPage = Math.ceil(rows ? rows / (limit || rows) : 0);

    data = await Region.find(queries)
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

export const getRegionById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const data = await Region.findOne({ _id }).select('-__v').exec();

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

export const updateRegionById = async (req, res) => {
  const { id: _id } = req.params;
  const payload = req.body;

  try {
    await Region.findOneAndUpdate(
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

export const deleteRegionById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await Region.deleteOne({ _id }).exec();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};
