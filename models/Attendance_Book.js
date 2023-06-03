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
    },
    expire_at: { type: Date, default: Date.now, expires: 86400 * 7 },
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
