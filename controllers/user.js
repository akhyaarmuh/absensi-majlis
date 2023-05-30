import User from '../models/User.js';
import { formatterErrorValidation } from '../utilities/mongoose.js';

// create user
export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);

    await newUser.save();
    res.status(201).json({ data: newUser });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: formatterErrorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// get all user
export const getAllUser = async (req, res) => {
  const { page = 0, limit = 0, sort = 'role full_name' } = req.query;
  const queries = {};

  try {
    const rows = await User.countDocuments(queries);
    const allPage = !rows ? 0 : !limit ? 1 : Math.ceil(rows / limit);

    const data = await User.find(queries)
      .select('-password -refresh_token -__v')
      .sort(sort)
      .skip(page * limit)
      .limit(limit || rows);
    res.json({ data, page: Number(page), limit: Number(limit), rows, allPage });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

// get user by id
export const getUserById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const data = await User.findOne({ _id }, '-password -refresh_token -__v');
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

// update user by id
export const updateUserById = async (req, res) => {
  const { id: _id } = req.params;
  const payload = req.body;

  try {
    await User.findOneAndUpdate(
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

// update password by id
export const updatePasswordById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const user = await User.findOne({ _id });

    user.set('password', req.body.password);
    await user.save();

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

// update status by id
export const updateStatusdById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const user = await User.findOne({ _id });

    await User.findOneAndUpdate({ _id }, { status: user.status ? 0 : 1 });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// delete user by id
export const deleteUserById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await User.deleteOne({ _id });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};
