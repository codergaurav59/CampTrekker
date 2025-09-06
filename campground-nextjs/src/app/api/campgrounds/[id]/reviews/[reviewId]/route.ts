import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Campground from '@/models/Campground';
import Review from '@/models/Review';
import { getAuthUser } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
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

    const review = await Review.findById(params.reviewId);
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user is the author of the review
    if (review.author.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this review' },
        { status: 403 }
      );
    }

    // Remove review from campground
    await Campground.findByIdAndUpdate(params.id, {
      $pull: { reviews: params.reviewId }
    });

    // Delete the review
    await Review.findByIdAndDelete(params.reviewId);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}