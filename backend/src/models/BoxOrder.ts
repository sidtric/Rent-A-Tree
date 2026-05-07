import mongoose from 'mongoose';

const boxOrderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:           [{ name: String, qty: Number, price: Number }],
  totalAmount:     { type: Number, required: true },
  paymentId:       { type: String, unique: true, sparse: true },
  deliveryAddress: { type: String, required: true },
  status:          { type: String, default: 'confirmed' },
}, { timestamps: true });

export default mongoose.model('BoxOrder', boxOrderSchema);
