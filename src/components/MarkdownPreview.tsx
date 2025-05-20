'use client';

import React from 'react';
import { useEffect, useState } from 'react';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  // For now, just render the plain text content with some basic formatting
  // This avoids the MDX serialization issues during build
  return (
    <div className="text-gray-600 dark:text-gray-300 text-sm">
      <span>{content.substring(0, 300)}</span>
      <span className="text-blue-600 dark:text-blue-400 ml-1">...</span>
    </div>
  );
}
