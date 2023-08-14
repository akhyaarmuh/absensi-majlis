import fs from 'fs';
import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

import { __dirname } from '../utilities/index.js';

const memberSchema = new Schema(
  {
    no_induk: {
      type: String,
      required: true,
      trim: true,
      index: true,
      match: [/^\d+$/, 'No induk tidak benar (hanya nomor)'],
      validate: {
        validator: async function (value) {
          const _id = this.get('_id').toString();
          const count = await mongoose.models.Member.countDocuments({
            no_induk: new RegExp(`^${value}$`, 'i'),
            _id: { $ne: _id },
          });

          return !count;
        },
        message: 'No induk sudah digunakan',
      },
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'Terlalu pendek, setidaknya 3 karakter'],
      maxLength: [25, 'Panjang maksimal 25 karakter'],
      match: [/^[a-zA-Z\s]*$/, 'Masukan nama yang benar (hanya huruf)'],
    },
    birth: {
      type: Date,
      required: true,
    },
    parent_name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'Terlalu pendek, setidaknya 3 karakter'],
      maxLength: [25, 'Panjang maksimal 25 karakter'],
      match: [/^[a-zA-Z\s]*$/, 'Masukan nama yang benar (hanya huruf)'],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: ObjectId,
      required: true,
      ref: 'Region',
    },
    status: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      trim: true,
    },
    attendance_dzikiran: [
      {
        event_id: {
          type: ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
      { _id: false },
    ],
    absent_kematian: [
      {
        event_id: {
          type: ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
      { _id: false },
    ],
    absent_dzikiran: [
      {
        event_id: {
          type: ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
      { _id: false },
    ],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

memberSchema.pre('deleteOne', async function (next) {
  // delete member on attendance_book.member_id
  const attendanceDeleting = await mongoose.models.Attendance_Book.find({
    member_id: this._conditions._id,
  });
  for (const attendance of attendanceDeleting) {
    await mongoose.models.Attendance_Book.deleteOne({ _id: attendance._id });
  }

  // delete member on Event.absent
  await mongoose.models.Event.updateMany(
    {
      absent: this._conditions._id,
    },
    {
      $pullAll: {
        absent: [this._conditions._id],
      },
    }
  );

  // delete member.image on server
  const deletingMember = await mongoose.models.Member.findOne(this._conditions);
  if (deletingMember.image)
    fs.unlinkSync(`${__dirname}/public/images/${deletingMember.image}`);

  next();
});

memberSchema.index({ full_name: 1, region: 1 });

export default model('Member', memberSchema);
