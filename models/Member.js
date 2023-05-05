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
      index: true,
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
      index: true,
      ref: 'Region',
    },
    status: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      trim: true,
    },
    attend_dzikiran: [
      {
        type: ObjectId,
        index: true,
      },
    ],
    attend_kematian: [
      {
        type: ObjectId,
        index: true,
      },
    ],
    absent_dzikiran: [
      {
        type: ObjectId,
        index: true,
      },
    ],
    absent_kematian: [
      {
        type: ObjectId,
        index: true,
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      UpdatedAt: 'updated_at',
    },
  }
);

memberSchema.pre('deleteOne', async function (next) {
  const presentDeleted = await mongoose.models.PresentBook.find({
    member: this._conditions._id,
  }).exec();

  for (const present of presentDeleted) {
    await mongoose.models.PresentBook.deleteOne({ _id: present._id }).exec();
  }

  const deletingMember = await mongoose.models.Member.findOne(this._conditions);
  if (deletingMember.image)
    fs.unlinkSync(`${__dirname}/public/images/${deletingMember.image}`);

  next();
});

export default model('Member', memberSchema);
