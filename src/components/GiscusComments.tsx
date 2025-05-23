'use client';

import React, { useEffect, useRef } from 'react';

const GiscusComments: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const scriptElem = document.createElement('script');
    scriptElem.src = 'https://giscus.app/client.js';
    scriptElem.async = true;
    scriptElem.crossOrigin = 'anonymous';

    scriptElem.setAttribute('data-repo', 'nirzaf/nirzaf.github.io');
    scriptElem.setAttribute('data-repo-id', 'MDEwOlJlcG9zaXRvcnkxNzA0OTgwODg=');
    scriptElem.setAttribute('data-category', 'General');
    scriptElem.setAttribute('data-category-id', 'DIC_kwDOCimYKM4Cqecv');
    scriptElem.setAttribute('data-mapping', 'pathname');
    scriptElem.setAttribute('data-strict', '0');
    scriptElem.setAttribute('data-reactions-enabled', '1');
    scriptElem.setAttribute('data-emit-metadata', '0');
    scriptElem.setAttribute('data-input-position', 'bottom');
    scriptElem.setAttribute('data-theme', 'preferred_color_scheme');
    scriptElem.setAttribute('data-lang', 'en');
    scriptElem.setAttribute('data-loading', 'lazy');

    ref.current.appendChild(scriptElem);
  }, []);

  return <div ref={ref} />;
};

export default GiscusComments;
