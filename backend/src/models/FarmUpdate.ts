import mongoose, { Document, Schema } from 'mongoose';

export interface IFarmUpdate extends Document {
  rental: mongoose.Types.ObjectId;
  caption: string;
  media: { url: string; type: 'image' | 'video' }[];
}

const FarmUpdateSchema = new Schema<IFarmUpdate>(
  {
    rental:  { type: Schema.Types.ObjectId, ref: 'Rental', required: true },
    caption: { type: String, default: '' },
    media:   [{ url: String, type: { type: String, enum: ['image', 'video'] } }],
  },
  { timestamps: true }
);

export default mongoose.model<IFarmUpdate>('FarmUpdate', FarmUpdateSchema);
