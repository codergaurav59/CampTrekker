import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 drop-shadow-lg">
            CampTrekker
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md max-w-2xl mx-auto">
            Welcome to CampTrekker! Jump right in and explore our many campgrounds. 
            Feel free to share some of your own and comment on others!
          </p>
          
          <Link
            href="/campgrounds"
            className="inline-block bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View Campgrounds
          </Link>
        </div>
      </div>
      
      <footer className="absolute bottom-0 w-full text-center text-white/70 py-4">
        <p>&copy; 2025 CampTrekker. All rights reserved.</p>
      </footer>
    </div>
  );
}