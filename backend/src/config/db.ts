import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI as string;
  await mongoose.connect(uri);
};

export default connectDB;
