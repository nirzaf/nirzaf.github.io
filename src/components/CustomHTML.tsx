'use client';

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface CustomHTMLProps {
  html: string;
}

export function CustomHTML({ html }: CustomHTMLProps) {
  // Function to sanitize and fix HTML attributes
  const sanitizeAndFixHTML = (htmlContent: string): string => {
    // Fix common React attribute issues in iframes
    const fixedHTML = htmlContent
      // Replace iframe tags with custom components
      .replace(/<iframe/g, '<custom-iframe')
      .replace(/<\/iframe>/g, '</custom-iframe>')
      // Fix nested p tags - replace any p tags inside p tags with span
      .replace(/<p([^>]*)>(.*?)<p([^>]*)>/g, '<p$1>$2<span$3>')
      .replace(/<\/p>(.*?)<\/p>/g, '</span>$1</p>')
      // Fix div inside p tags - replace with span
      .replace(/<p([^>]*)>(.*?)<div([^>]*)>/g, '<p$1>$2<span$3>')
      .replace(/<\/div>(.*?)<\/p>/g, '</span>$1</p>')
      // Fix class attribute to className
      .replace(/ class=/g, ' className=')
      .replace(/class=/g, 'className=')
      // Fix frameborder attribute
      .replace(/frameborder=["']([^"']*)["']/g, 'frameBorder="$1"')
      // Fix allowfullscreen attribute - use JSX boolean syntax
      .replace(/allowfullscreen(=["']([^"']*)["'])?/g, 'allowFullScreen={true}')
      // Fix marginheight and marginwidth attributes
      .replace(/marginheight=["']([^"']*)["']/g, 'marginHeight="$1"')
      .replace(/marginwidth=["']([^"']*)["']/g, 'marginWidth="$1"')
      // Fix scrolling attribute
      .replace(/scrolling=["']([^"']*)["']/g, 'scrolling="$1"');

    // Sanitize the HTML to prevent XSS attacks
    return DOMPurify.sanitize(fixedHTML, {
      ADD_ATTR: ['target', 'frameBorder', 'allowFullScreen', 'marginHeight', 'marginWidth', 'scrolling', 'className', 'style'],
      ADD_TAGS: ['custom-iframe', 'span'],
    });
  };

  // Sanitize and fix the HTML
  const sanitizedHTML = sanitizeAndFixHTML(html);

  return (
    <div
      className="custom-html-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}
