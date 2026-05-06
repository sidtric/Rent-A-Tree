import mongoose, { Document, Schema } from 'mongoose';

export interface IFarmPhoto extends Document {
  caption: string;
  url: string;
}

const FarmPhotoSchema = new Schema<IFarmPhoto>(
  {
    caption: { type: String, default: '' },
    url:     { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFarmPhoto>('FarmPhoto', FarmPhotoSchema);
