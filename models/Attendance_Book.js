import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

const attendanceBookSchema = new Schema(
  {
    event_id: {
      type: ObjectId,
      required: true,
      ref: 'Event',
    },
    member_id: {
      type: ObjectId,
      required: true,
      ref: 'Member',
      // validate: {
      //   validator: async function (value) {
      //     // const _id = this.get('_id').toString();
      //     const event = this.get('event').toString();
      //     const count = await mongoose.models.PresentBook.countDocuments({
      //       event,
      //       member: value,
      //       // _id: { $ne: _id },
      //     });
      //     return !count;
      //   },
      //   message: 'Anggota sudah berhasil absen',
      // },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

attendanceBookSchema.index({ event_id: 1, member_id: 1 }, { unique: true });

export default model('Attendance_Book', attendanceBookSchema);
