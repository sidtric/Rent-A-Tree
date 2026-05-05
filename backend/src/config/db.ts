import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI as string;
  await mongoose.connect(uri);
  // Drop old unique email index (pre-OTP migration had unique:true without sparse)
  await mongoose.connection.collection('users').dropIndex('email_1').catch(() => {});
};

export default connectDB;
