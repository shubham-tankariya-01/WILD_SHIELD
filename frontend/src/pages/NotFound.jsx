import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-fade-in text-center">
      <h1 className="text-7xl sm:text-9xl font-black text-forest-100 mb-2 sm:mb-4">404</h1>
      <h2 className="text-xl sm:text-3xl font-bold text-text-primary mb-2">Page Not Found</h2>
      <p className="text-sm sm:text-base text-text-secondary mb-6 sm:mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl text-sm sm:text-base w-full sm:w-auto justify-center">
        <HiHome className="text-lg sm:text-xl flex-shrink-0" /> Back to Home
      </Link>
    </div>
  );
}
