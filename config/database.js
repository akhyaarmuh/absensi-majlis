import mongoose from 'mongoose';

try {
  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Database Connected');
} catch (error) {
  console.error(error);
}
