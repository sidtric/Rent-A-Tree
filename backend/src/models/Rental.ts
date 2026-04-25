import mongoose, { Document, Schema } from 'mongoose';

export type RentalStatus = 'active' | 'completed' | 'cancelled';

export interface IRental extends Document {
  user: mongoose.Types.ObjectId;
  tree: mongoose.Types.ObjectId;
  season: string;
  status: RentalStatus;
  deliveryAddress: string;
  estimatedYield?: number;
  paymentId?: string;
}

const RentalSchema = new Schema<IRental>(
  {
    user:            { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tree:            { type: Schema.Types.ObjectId, ref: 'Tree', required: true },
    season:          { type: String, required: true },
    status:          { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    deliveryAddress: { type: String, required: true },
    estimatedYield:  { type: Number },
    paymentId:       { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IRental>('Rental', RentalSchema);
