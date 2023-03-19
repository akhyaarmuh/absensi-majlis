import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'Terlalu pendek, setidaknya 3 karakter'],
      maxLength: [25, 'Panjang maksimal 25 karakter'],
      match: [/^[a-zA-Z\s]*$/, 'Masukan nama yang benar (hanya huruf)'],
    },
    type: {
      type: String,
      required: true,
      enum: ['dzikiran', 'kematian'],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      UpdatedAt: 'updated_at',
    },
  }
);

eventSchema.pre('save', async function (next) {
  const count = await mongoose.models.Event.countDocuments({ status: 1 });

  if (count) throw { message: 'Masih ada kegiatan yang berlangsung' };
  else next();
});

eventSchema.pre('deleteOne', async function (next) {
  const presentDeleted = await mongoose.models.PresentBook.find({
    event: this._conditions._id,
  }).exec();

  for (const present of presentDeleted) {
    await mongoose.models.PresentBook.deleteOne({ _id: present._id }).exec();
  }

  await mongoose.models.Member.updateMany(
    {
      $or: [
        { attend_dzikiran: this._conditions._id },
        { attend_kematian: this._conditions._id },
        { absent_dzikiran: this._conditions._id },
        { absent_kematian: this._conditions._id },
      ],
    },
    {
      $pullAll: {
        attend_dzikiran: [this._conditions._id],
        attend_kematian: [this._conditions._id],
        absent_dzikiran: [this._conditions._id],
        absent_kematian: [this._conditions._id],
      },
    }
  ).exec();

  next();
});

export default model('Event', eventSchema);
