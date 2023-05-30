import bcrypt from 'bcrypt';
import mongoose, { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Nama lengkap diperlukan'],
      trim: true,
      minLength: [3, 'Terlalu pendek, setidaknya 3 karakter'],
      maxLength: [25, 'Panjang maksimal 25 karakter'],
      match: [/^[a-zA-Z\s]*$/, 'Masukan nama yang benar (hanya huruf)'],
    },
    username: {
      type: String,
      index: true,
      trim: true,
      minLength: [7, 'Terlalu pendek, setidaknya 7 karakter'],
      maxLength: [20, 'Panjang maksimal 20 karakter'],
      match: [/^[a-zA-Z0-9]*$/, 'Nama pengguna hanya huruf dan angka'],
      validate: {
        validator: async function (value) {
          if (!value) return true;

          const _id = this.get('_id').toString();
          const count = await mongoose.models.User.countDocuments({
            username: new RegExp(`^${value}$`, 'i'),
            _id: { $ne: _id },
          });
          return !count;
        },
        message: 'Username sudah digunakan',
      },
    },
    email: {
      type: String,
      required: [true, 'Email diperlukan'],
      index: true,
      trim: true,
      lowercase: true,
      minLength: [6, 'Terlalu pendek, setidaknya 6 karakter'],
      maxLength: [128, 'Panjang maksimal 128 karakter'],
      match: [/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/, 'Masukan email yang benar'],
      validate: {
        validator: async function (value) {
          const _id = this.get('_id').toString();
          const count = await mongoose.models.User.countDocuments({
            email: new RegExp(`^${value}$`, 'i'),
            _id: { $ne: _id },
          });
          return !count;
        },
        message: 'Email sudah terdaftar',
      },
    },
    password: {
      type: String,
      required: [true, 'Katasandi diperlukan'],
      trim: true,
      minLength: [7, 'Terlalu pendek, setidaknya 7 karakter'],
      maxLength: [20, 'Panjang maksimal 20 karakter'],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&_]*$/,
        'Katasandi harus memiliki setidaknya satu huruf besar, huruf kecil dan angka',
      ],
    },
    status: {
      type: Number,
      default: 1,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'user'],
      default: 'user',
    },
    refresh_token: {
      type: String,
    },
    whatsapp: { type: String, match: [/^62+8[1-9][0-9]{6,10}$/, 'Nomor tidak benar'] },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

userSchema.methods.checkPassword = async function (password) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

export default model('User', userSchema);
