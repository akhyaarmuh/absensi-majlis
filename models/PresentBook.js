import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

const presentBookSchema = new Schema(
  {
    event: {
      type: ObjectId,
      required: true,
      ref: 'Event',
    },
    member: {
      type: ObjectId,
      required: true,
      ref: 'Member',
      validate: {
        validator: async function (value) {
          const _id = this.get('_id').toString();
          const event = this.get('event').toString();
          const count = await mongoose.models.PresentBook.countDocuments({
            event,
            member: value,
            _id: { $ne: _id },
          });
          return !count;
        },
        message: 'Anggota sudah berhasil absen',
      },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      UpdatedAt: 'updated_at',
    },
  }
);

export default model('PresentBook', presentBookSchema);
