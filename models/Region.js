import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const regionSchema = new Schema(
  {
    name: {
      type: String,
      index: true,
      required: true,
      trim: true,
      minLength: [3, 'Terlalu pendek, setidaknya 3 karakter'],
      maxLength: [25, 'Panjang maksimal 25 karakter'],
      match: [/^[a-zA-Z\s]*$/, 'Data tidak benar (hanya huruf)'],
      validate: {
        validator: async function (value) {
          const _id = this.get('_id');
          const count = await mongoose.models.Region.countDocuments({
            name: new RegExp(`^${value}$`, 'i'),
            _id: { $ne: _id },
          });
          return !count;
        },
        message: 'Wilayah sudah ada',
      },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

regionSchema.pre('deleteOne', async function (next) {
  // delete member with this region
  const memberDeleting = await mongoose.models.Member.find({
    region: this._conditions._id,
  }).exec();
  for (const member of memberDeleting) {
    await mongoose.models.Member.deleteOne({ _id: member._id }).exec();
  }

  next();
});

export default model('Region', regionSchema);
