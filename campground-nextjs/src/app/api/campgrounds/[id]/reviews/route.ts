import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Campground from '@/models/Campground';
import Review from '@/models/Review';
import { getAuthUser } from '@/lib/auth';
import { reviewSchema } from '@/lib/validation';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const campground = await Campground.findById(params.id);
    if (!campground) {
      return NextResponse.json(
        { error: 'Campground not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { error, value } = reviewSchema.validate(body);
    
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const review = new Review({
      ...value,
      author: user.id,
      campground: params.id,
    });

    await review.save();
    await review.populate('author', 'username');

    campground.reviews.push(review._id);
    await campground.save();

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}