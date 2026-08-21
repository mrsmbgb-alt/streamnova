import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-8xl font-black gradient-text">404</div>
      <h1 className="text-white text-2xl font-bold">Page Not Found</h1>
      <p className="text-gray-400 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
        >
          <Home size={18} />
          Go Home
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
        >
          <Search size={18} />
          Search
        </Link>
      </div>
    </div>
  );
}
