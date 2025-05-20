import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        The page you are looking for does not exist.
      </p>
      <div className="flex justify-center">
        <Link 
          href="/" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          data-cy="home-link"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
