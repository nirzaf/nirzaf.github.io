import { Suspense } from 'react';
import { ClientSearch } from '@/components/ClientSearch';

export const metadata = {
  title: 'Search Blog Posts',
  description: 'Search through all blog posts on the site',
};

function SearchContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Blog Posts</h1>
      <ClientSearch />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
