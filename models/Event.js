import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

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
      required: true,
      default: 1,
    },
    attendance: {
      type: Number,
      default: 0,
    },
    absent: [
      {
        type: ObjectId,
        required: true,
        ref: 'Member',
      },
    ],
    expire_at: { type: Date, default: Date.now, expires: 86400 * 360 },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

eventSchema.pre('save', async function (next) {
  const count = await mongoose.models.Event.countDocuments({ status: 1 });

  if (count) throw { message: 'Masih ada kegiatan yang berlangsung' };
  else next();
});

eventSchema.pre('deleteOne', async function (next) {
  // delete event on attendance_book.event_id
  const attendanceDeleting = await mongoose.models.Attendance_Book.find({
    event_id: this._conditions._id,
  });
  for (const attendance of attendanceDeleting) {
    await mongoose.models.Attendance_Book.deleteOne({ _id: attendance._id });
  }

  // delete event on Member.attendance_dzikiran[{event_id}], Member.absent_kematian[{event_id}] & Member.absent_dzikiran[{event_id}]
  await mongoose.models.Member.updateMany(
    {
      $or: [
        { 'attendance_dzikiran.event_id': this._conditions._id },
        { 'absent_kematian.event_id': this._conditions._id },
        { 'absent_dzikiran.event_id': this._conditions._id },
      ],
    },
    {
      $pull: {
        attendance_dzikiran: { event_id: this._conditions._id },
        absent_kematian: { event_id: this._conditions._id },
        absent_dzikiran: { event_id: this._conditions._id },
      },
    },
    { safe: true, multi: true }
  );

  next();
});

export default model('Event', eventSchema);
