import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name:     string;
  email:    string;
  password: string;
  phone?:   string;
  address?: string;
  isAdmin:  boolean;
  comparePassword(p: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone:    { type: String },
    address:  { type: String },
    isAdmin:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (p: string) {
  return bcrypt.compare(p, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
