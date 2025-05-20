'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Import MDXContent with SSR disabled to ensure it only renders on the client
const MDXContent = dynamic(() => import('./MDXContent').then(mod => mod.MDXContent), {
  ssr: false,
  loading: () => <div>Loading content...</div>
});

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  // Use state to ensure hydration
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="prose prose-lg dark:prose-invert max-w-none">Loading content...</div>;
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <MDXContent source={content} />
    </div>
  );
}
