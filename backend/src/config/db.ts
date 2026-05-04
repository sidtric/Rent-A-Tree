import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI as string;
  await mongoose.connect(uri);
};

export default connectDB;
