'use client';
import { MDXRemote } from 'next-mdx-remote';
import Prism from 'prismjs';
// Import language grammars
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup-templating'; // For HTML, XML, SVG, MathML
// Note: CSS, JavaScript, and Markup (HTML, XML, etc.) are often included by default or as dependencies.
// Adding them explicitly ensures they are available.

import Image from 'next/image';
import React, { useEffect } from 'react';
import { CustomHTML } from './CustomHTML';
import { MermaidDiagram } from './MermaidDiagram';
import mermaid from 'mermaid';

// Define custom components for MDX
const components = {
  h1: (props: React.HTMLAttributes<HTMLElement>) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLElement>) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLElement>) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
  h4: (props: React.HTMLAttributes<HTMLElement>) => <h4 className="text-lg font-bold mt-4 mb-2" {...props} />,
  p: (props: React.HTMLAttributes<HTMLElement>) => <p className="mb-4" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-blue-600 dark:text-blue-400 hover:underline"
      target={props.href && props.href.startsWith('http') ? '_blank' : undefined}
      rel={props.href && props.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLElement>) => <ul className="list-disc pl-6 mb-4" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLElement>) => <ol className="list-decimal pl-6 mb-4" {...props} />,
  li: (props: React.HTMLAttributes<HTMLElement>) => <li className="mb-1" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4" {...props} />
  ),
  hr: () => <hr className="my-8 border-gray-300 dark:border-gray-700" />,
  // Replace the img component with a fragment to avoid nesting issues
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // Extract alt and other props
    const { alt, ...otherProps } = props;
    const imageAlt = alt || 'Blog image';

    // Return a fragment instead of a div to avoid nesting issues
    return (
      <>
        <img
          alt={imageAlt}
          className="rounded-lg shadow-md mx-auto my-6"
          {...otherProps}
        />
        {alt && <span className="block text-center text-sm text-gray-500 mt-2 mb-6">{alt}</span>}
      </>
    );
  },
  iframe: (props: React.IframeHTMLAttributes<HTMLIFrameElement> & { frameborder?: string; allowfullscreen?: boolean }) => {
    // Convert HTML attributes to React properties (camelCase)
    const { frameborder, allowfullscreen, ...otherProps } = props;

    const reactProps: React.IframeHTMLAttributes<HTMLIFrameElement> = {
      ...otherProps,
      frameBorder: props.frameBorder || frameborder || "0",
      // Use boolean true instead of string "true"
      allowFullScreen: props.allowFullScreen !== undefined ? props.allowFullScreen :
                      allowfullscreen !== undefined ? !!allowfullscreen : true,
    };

    // Use a div that will be rendered outside of any p tags
    return (
      <div className="my-6 aspect-video">
        <iframe
          className="w-full h-full rounded-lg shadow-md"
          {...reactProps}
        />
      </div>
    );
  },
  Image: (props: React.ComponentProps<typeof Image>) => {
    const { alt, ...otherProps } = props;
    const imageAlt = alt || 'Blog image';

    return (
      <>
        <div className="my-6">
          <Image alt={imageAlt} {...otherProps} />
        </div>
        {alt && (
          <span className="block text-center text-sm text-gray-500 mt-2 mb-6">{alt}</span>
        )}
      </>
    );
  },
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const { className, children, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';

    // Handle Mermaid diagrams
    if (language === 'mermaid' && typeof children === 'string') {
      return <MermaidDiagram chart={children} />;
    }

    if (language) {
      const handleCopy = () => {
        if (typeof children === 'string') {
          navigator.clipboard.writeText(children);
          // Add visual feedback (e.g., change button text)
          const button = document.getElementById(`copy-button-${language}-${children.substring(0,10)}`);
          if (button) {
            button.textContent = 'Copied!';
            setTimeout(() => {
              button.textContent = 'Copy';
            }, 2000);
          }
        }
      };

      return (
        <div className="relative group">
          <pre className={`language-${language} rounded-lg overflow-auto p-4 my-6 bg-gray-100 dark:bg-gray-800`}>
            <code className={`language-${language}`} {...rest}>
              {children}
            </code>
          </pre>
          <button
            id={`copy-button-${language}-${children?.toString().substring(0,10)}`}
            onClick={handleCopy}
            className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Copy
          </button>
        </div>
      );
    }

    return (
      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...rest}>
        {children}
      </code>
    );
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    // If pre is used directly, ensure it has relative positioning for copy button if we decide to support that
    <div className="relative group">
       <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto mb-6 font-mono text-sm" {...props} />
    </div>
  ),
  table: (props: React.HTMLAttributes<HTMLElement>) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLElement>) => (
    <th className="px-4 py-3 text-left text-sm font-semibold bg-gray-100 dark:bg-gray-800" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLElement>) => <td className="px-4 py-3 text-sm border-t" {...props} />,
  // Custom components
  Tweet: ({ id }: { id: string }) => (
    <div className="my-6 mx-auto max-w-xl">
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
        <p className="text-center text-gray-500">Twitter embed placeholder for tweet ID: {id}</p>
      </div>
    </div>
  ),
  YouTubeVideo: ({ id }: { id: string }) => (
    <div className="my-6 aspect-video">
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 h-full flex items-center justify-center">
        <p className="text-center text-gray-500">YouTube embed placeholder for video ID: {id}</p>
      </div>
    </div>
  ),
};

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  useEffect(() => {
    // Highlight code blocks when component mounts
    Prism.highlightAll();
    
    // Initialize mermaid
    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      });
    } catch (error) {
      console.error('Mermaid initialization error:', error);
    }
  }, [source]);

  // Parse the JSON string back to an object
  const mdxSource = JSON.parse(source);

  // Add CustomHTML component to handle HTML content
  const enhancedComponents = {
    ...components,
    // Add a component to handle raw HTML content
    html: ({ children }: { children: string }) => {
      return <CustomHTML html={children} />;
    },
    // Add custom iframe component to handle iframe attributes
    iframe: (props: React.IframeHTMLAttributes<HTMLIFrameElement> & { frameborder?: string; allowfullscreen?: boolean }) => {
      const { frameborder, allowfullscreen, ...otherProps } = props;

      // Create a div outside of any potential p tags
      return (
        <div className="my-6 aspect-video">
          <iframe
            className="w-full h-full rounded-lg shadow-md"
            frameBorder={frameborder || "0"}
            allowFullScreen={allowfullscreen !== undefined ? !!allowfullscreen : true}
            {...otherProps}
          />
        </div>
      );
    }
  };

  return <MDXRemote
    {...mdxSource}
    components={enhancedComponents}
  />;
}
