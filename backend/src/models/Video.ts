import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  url: string;
}

const VideoSchema = new Schema<IVideo>(
  {
    title:       { type: String, required: true },
    description: { type: String, default: '' },
    url:         { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IVideo>('Video', VideoSchema);
