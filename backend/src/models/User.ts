import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  phone: string;
  otp?: string;
  otpExpiry?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:      { type: String, trim: true },
    phone:     { type: String, required: true, unique: true },
    otp:       { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
