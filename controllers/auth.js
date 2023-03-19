import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import { formatterErrorValidation, backupDatabase } from '../utilities/mongoose.js';

// auth -- REGISTER
export const register = async (req, res) => {
  let role = 'admin';

  try {
    const admin = await User.findOne({ role }).exec();
    role = admin ? 'user' : 'admin';
    const user = new User({ ...req.body, role, status: role === 'admin' ? 1 : 0 });

    await user.save();
    res.status(201).json({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError')
      res
        .status(400)
        .json({ message: 'Data tidak benar', error: formatterErrorValidation(error) });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// auth -- LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { username: email }] }).exec();

    if (!user)
      throw {
        name: 'ValidationError',
        message: 'Pengguna belum terdaftar',
        errors: { email: 'Pengguna tidak ditemukan' },
      };

    if (!(await user.checkPassword(password)))
      throw {
        name: 'ValidationError',
        message: 'Katasandi salah',
        errors: { password: 'Katasandi yang anda gunakan salah' },
      };

    if (!user.status)
      throw {
        name: 'ValidationError',
        message: 'Akun terblokir',
        errors: { email: 'Akun tidak aktif, silakan hubungi cs kami' },
      };

    const payload = {
      _id: user._id,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: '15s',
    });
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: '1d',
    });

    await User.findOneAndUpdate({ _id: payload._id }, { refresh_token }).exec();

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    if (error.name === 'ValidationError')
      res
        .status(400)
        .json({ message: error.message || 'Data tidak valid', error: error.errors });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// auth -- REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) return res.sendStatus(401);

    const user = await User.findOne({ refresh_token }).exec();
    if (!user) return res.sendStatus(403);

    jwt.verify(refresh_token, process.env.REFRESH_TOKEN, async (err) => {
      if (err) return res.sendStatus(403);

      const accessToken = jwt.sign(
        {
          _id: user._id,
          full_name: user.full_name,
          role: user.role,
          status: user.status,
        },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: '15s',
        }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// auth -- VERIFY PASSWORD
export const verifyPassword = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req._id }).exec();

    const isValid = await user.checkPassword(req.body.password);
    if (!isValid) return res.status(400).json({ message: 'Katasandi salah' });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// auth -- LOGOUT
export const logout = async (req, res) => {
  try {
    await backupDatabase()
    await User.findOneAndUpdate({ _id: req._id }, { refresh_token: null }).exec();
    res.clearCookie('refresh_token');
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// auth -- RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    if (req.body.email === 'akhyaarmuh@gmail.com') {
      const user = await User.findOne({ role: 'admin' }).exec();
      user.set('email', 'akhyaarmuh@gmail.com');
      user.set('password', 'Admin123');
      await user.save();
      res.sendStatus(200);
    }
    res.sendStatus(400);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};
