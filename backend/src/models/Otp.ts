import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
  phone: string;
  otp: string;
  expiry: Date;
}

const OtpSchema = new Schema<IOtp>({
  phone:  { type: String, required: true, unique: true },
  otp:    { type: String, required: true },
  expiry: { type: Date,   required: true },
});

export default mongoose.model<IOtp>('Otp', OtpSchema, 'otps');
