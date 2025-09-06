import mongoose, { Document, Schema } from 'mongoose';

interface IImage {
  url: string;
  filename: string;
}

interface IGeometry {
  type: 'Point';
  coordinates: [number, number];
}

export interface ICampground extends Document {
  title: string;
  price: number;
  description: string;
  location: string;
  geometry: IGeometry;
  images: IImage[];
  author: mongoose.Types.ObjectId;
  reviews: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema<ICampground>({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review',
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

CampgroundSchema.virtual('properties.popupText').get(function() {
  return `<strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}...</p>`;
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Review = mongoose.model('Review');
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    });
  }
});

export default mongoose.models.Campground || mongoose.model<ICampground>('Campground', CampgroundSchema);