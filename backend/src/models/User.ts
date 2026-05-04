import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name?:    string;
  phone:    string;
  email?:   string;
  address?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name:    { type: String, trim: true },
    phone:   { type: String, required: true, unique: true },
    email:   { type: String, lowercase: true, sparse: true },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
