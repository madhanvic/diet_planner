import mongoose from 'mongoose';

const MONGO_URI: string = process.env.MONGODB_URI as string;

export const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected successfully');
};
