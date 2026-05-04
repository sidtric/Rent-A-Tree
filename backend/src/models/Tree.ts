import mongoose, { Document, Schema } from 'mongoose';

export type TreePlan = 'sapling' | 'adult' | 'grand';

export interface ITree extends Document {
  plan: TreePlan;
  name: string;
  location: string;
  yieldMin: number;
  yieldMax: number;
  priceMin: number;
  priceMax: number;
  pricePerSeason: number;
  isAvailable: boolean;
  imageUrl?: string;
}

const TreeSchema = new Schema<ITree>(
  {
    plan:           { type: String, enum: ['sapling', 'adult', 'grand'], required: true },
    name:           { type: String, required: true },
    location:       { type: String, default: 'Ramnagar, Uttarakhand' },
    yieldMin:       { type: Number, required: true },
    yieldMax:       { type: Number, required: true },
    priceMin:       { type: Number, required: true },
    priceMax:       { type: Number, required: true },
    pricePerSeason: { type: Number, required: true },
    isAvailable:    { type: Boolean, default: true },
    imageUrl:       { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ITree>('Tree', TreeSchema);
