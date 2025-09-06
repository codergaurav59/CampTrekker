import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  body: string;
  rating: number;
  author: mongoose.Types.ObjectId;
  campground: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  campground: {
    type: Schema.Types.ObjectId,
    ref: 'Campground',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);