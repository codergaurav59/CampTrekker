'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MapBox from '@/components/MapBox';

interface Review {
  _id: string;
  body: string;
  rating: number;
  author: {
    username: string;
  };
  createdAt: string;
}

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
    _id: string;
    username: string;
  };
  reviews: Review[];
}

export default function CampgroundDetailPage({ params }: { params: { id: string } }) {
  const [campground, setCampground] = useState<Campground | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewData, setReviewData] = useState({ rating: 5, body: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCampground = async () => {
      try {
        const response = await fetch(`/api/campgrounds/${params.id}`);
        if (!response.ok) {
          throw new Error('Campground not found');
        }
        const data = await response.json();
        setCampground(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCampground();
  }, [params.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      const response = await fetch(`/api/campgrounds/${params.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Refresh campground data to show new review
      const campgroundResponse = await fetch(`/api/campgrounds/${params.id}`);
      const updatedCampground = await campgroundResponse.json();
      setCampground(updatedCampground);
      setReviewData({ rating: 5, body: '' });
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/campgrounds/${params.id}/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh campground data
        const campgroundResponse = await fetch(`/api/campgrounds/${params.id}`);
        const updatedCampground = await campgroundResponse.json();
        setCampground(updatedCampground);
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const handleDeleteCampground = async () => {
    if (!confirm('Are you sure you want to delete this campground?')) return;

    try {
      const response = await fetch(`/api/campgrounds/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/campgrounds');
      }
    } catch (err) {
      console.error('Error deleting campground:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !campground) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Campground not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image Carousel */}
            <div>
              {campground.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative h-96 rounded-lg overflow-hidden">
                    <Image
                      src={campground.images[currentImageIndex].url}
                      alt={campground.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {campground.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {campground.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                            index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          <Image
                            src={image.url}
                            alt={`${campground.title} ${index + 1}`}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>

            {/* Campground Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{campground.title}</h1>
                <p className="text-gray-600 mb-4">{campground.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-700">{campground.location}</span>
                  <span className="text-2xl font-bold text-green-600">${campground.price}/night</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">By {campground.author.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push(`/campgrounds/${campground._id}/edit`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteCampground}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <MapBox
              center={campground.geometry.coordinates}
              zoom={10}
              height="300px"
              showMarker={true}
            />
          </div>

          {/* Reviews Section */}
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Leave a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating: {reviewData.rating}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={reviewData.rating}
                    onChange={(e) => setReviewData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="reviewBody" className="block text-sm font-medium text-gray-700 mb-2">
                    Review
                  </label>
                  <textarea
                    id="reviewBody"
                    value={reviewData.body}
                    onChange={(e) => setReviewData(prev => ({ ...prev, body: e.target.value }))}
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your review..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 transition-colors"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {campground.reviews.map((review) => (
                <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.author.username}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-700">{review.body}</p>
                </div>
              ))}
              {campground.reviews.length === 0 && (
                <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}