import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Campground from '@/models/Campground';
import { getAuthUser } from '@/lib/auth';
import { campgroundSchema } from '@/lib/validation';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const campground = await Campground.findById(params.id)
      .populate('author', 'username')
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          select: 'username'
        }
      });

    if (!campground) {
      return NextResponse.json(
        { error: 'Campground not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(campground);
  } catch (error) {
    console.error('Error fetching campground:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Check if user is the author
    if (campground.author.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to edit this campground' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const price = parseFloat(formData.get('price') as string);
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const newImages = formData.getAll('images') as File[];
    const deleteImages = formData.getAll('deleteImages') as string[];

    // Validate campground data
    const { error } = campgroundSchema.validate({
      title,
      price,
      location,
      description,
    });

    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    // Delete selected images
    if (deleteImages.length > 0) {
      for (const filename of deleteImages) {
        await deleteImage(filename);
      }
      campground.images = campground.images.filter(
        img => !deleteImages.includes(img.filename)
      );
    }

    // Upload new images
    for (const image of newImages) {
      if (image.size > 0) {
        const uploadResult = await uploadImage(image);
        campground.images.push(uploadResult);
      }
    }

    // Update campground
    campground.title = title;
    campground.price = price;
    campground.location = location;
    campground.description = description;

    await campground.save();
    await campground.populate('author', 'username');

    return NextResponse.json(campground);
  } catch (error) {
    console.error('Error updating campground:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if user is the author
    if (campground.author.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this campground' },
        { status: 403 }
      );
    }

    // Delete images from Cloudinary
    for (const image of campground.images) {
      await deleteImage(image.filename);
    }

    await Campground.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Campground deleted successfully' });
  } catch (error) {
    console.error('Error deleting campground:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}