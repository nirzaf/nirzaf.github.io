'use client';

import { useState } from 'react';

interface FeaturedImageProps {
  src: string | undefined;
  alt: string;
}

export function FeaturedImage({ src, alt }: FeaturedImageProps) {
  const defaultImage = 'https://ik.imagekit.io/quadrate/dotnetevangelist.jpeg?updatedAt=1747847469394';
  const [imageSrc, setImageSrc] = useState<string>(src || defaultImage);
  
  const handleImageError = () => {
    setImageSrc(defaultImage);
  };

  return (
    <div className="md:w-2/5 h-64 md:h-auto relative">
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
    </div>
  );
}
