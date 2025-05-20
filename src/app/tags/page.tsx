import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags } from '@/lib/mdxUtils';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse all blog post tags',
};

export default async function TagsPage() {
  const tags = await getAllTags();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tags</h1>
      
      <div className="flex flex-wrap gap-4">
        {Object.entries(tags).map(([tag, count]) => (
          <Link 
            key={tag} 
            href={`/tags/${tag}`}
            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium">#{tag}</span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">({count})</span>
          </Link>
        ))}
        
        {Object.keys(tags).length === 0 && (
          <p className="text-gray-600 dark:text-gray-300">No tags found.</p>
        )}
      </div>
    </div>
  );
}
