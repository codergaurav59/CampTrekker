import Link from 'next/link';
import Image from 'next/image';

interface Campground {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: Array<{
    url: string;
    filename: string;
  }>;
  author: {
    username: string;
  };
}

interface CampgroundCardProps {
  campground: Campground;
}

export default function CampgroundCard({ campground }: CampgroundCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        {campground.images.length > 0 ? (
          <Image
            src={campground.images[0].url}
            alt={campground.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {campground.title}
        </h3>
        
        <p className="text-gray-600 mb-3 line-clamp-2">
          {campground.description}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">{campground.location}</span>
          <span className="text-lg font-bold text-green-600">
            ${campground.price}/night
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            By {campground.author.username}
          </span>
          
          <Link
            href={`/campgrounds/${campground._id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}