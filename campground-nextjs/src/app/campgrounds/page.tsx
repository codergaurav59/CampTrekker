'use client';

import { useState, useEffect } from 'react';
import CampgroundCard from '@/components/CampgroundCard';
import MapBox from '@/components/MapBox';

interface Campground {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  geometry: {
    coordinates: [number, number];
  };
  images: Array<{
    url: string;
    filename: string;
  }>;
  author: {
    username: string;
  };
}

export default function CampgroundsPage() {
  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampgrounds = async () => {
      try {
        const response = await fetch('/api/campgrounds');
        if (!response.ok) {
          throw new Error('Failed to fetch campgrounds');
        }
        const data = await response.json();
        setCampgrounds(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCampgrounds();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campgrounds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Explore All Campgrounds
        </h1>
        
        {/* Interactive Map */}
        <div className="mb-8">
          <MapBox campgrounds={campgrounds} height="500px" />
        </div>

        {/* Campgrounds Grid */}
        {campgrounds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campgrounds.map((campground) => (
              <CampgroundCard key={campground._id} campground={campground} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No campgrounds available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}