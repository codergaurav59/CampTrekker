import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Campground from '@/models/Campground';
import { getAuthUser } from '@/lib/auth';
import { campgroundSchema } from '@/lib/validation';
import { uploadImage } from '@/lib/cloudinary';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const geocoder = mbxGeocoding({ accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN! });

export async function GET() {
  try {
    await dbConnect();
    
    const campgrounds = await Campground.find({})
      .populate('author', 'username')
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          select: 'username'
        }
      });

    return NextResponse.json(campgrounds);
  } catch (error) {
    console.error('Error fetching campgrounds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const price = parseFloat(formData.get('price') as string);
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const images = formData.getAll('images') as File[];

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

    // Geocode location
    const geoData = await geocoder.forwardGeocode({
      query: location,
      limit: 1,
    }).send();

    if (!geoData.body.features.length) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 400 }
      );
    }

    // Upload images
    const uploadedImages = [];
    for (const image of images) {
      if (image.size > 0) {
        const uploadResult = await uploadImage(image);
        uploadedImages.push(uploadResult);
      }
    }

    // Create campground
    const campground = new Campground({
      title,
      price,
      location,
      description,
      geometry: geoData.body.features[0].geometry,
      images: uploadedImages,
      author: user.id,
    });

    await campground.save();
    await campground.populate('author', 'username');

    return NextResponse.json(campground, { status: 201 });
  } catch (error) {
    console.error('Error creating campground:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}