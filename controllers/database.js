import path from 'path';

import User from '../models/User.js';
import Region from '../models/Region.js';
import Member from '../models/Member.js';
import Event from '../models/Event.js';
import { __dirname } from '../utilities/index.js';
import PresentBook from '../models/PresentBook.js';
import { restoreDatabase, formatterErrorValidation } from '../utilities/mongoose.js';

export const restore = async (req, res) => {
  const backup = req.files?.backup;

  try {
    const ext = path.extname(backup.name);

    if (!backup)
      throw {
        name: 'ValidationError',
        message: 'File tidak valid',
        errors: { file: { message: 'File tidak boleh kosong' } },
      };

    // cek extensi yang diizinkan
    if (ext.toLowerCase() !== '.json')
      throw {
        name: 'ValidationError',
        message: 'File tidak valid',
        errors: { file: { message: 'File yang diizinkan (.json)' } },
      };

    const fileName = 'majlis' + ext;

    backup.mv(`${__dirname}/${fileName}`, async (error) => {
      if (error) throw error;

      await User.collection.drop();
      await Region.collection.drop();
      await Member.collection.drop();
      await Event.collection.drop();
      await PresentBook.collection.drop();

      await restoreDatabase();
    });

    res.sendStatus(200);
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: formatterErrorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};
