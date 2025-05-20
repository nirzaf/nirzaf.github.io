import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Element } from 'hast';

/**
 * Rehype plugin to process Mermaid code blocks
 */
export const rehypeMermaid: Plugin = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      // Find code elements with language-mermaid class
      if (
        node.tagName === 'pre' &&
        node.children.length === 1 &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        const codeNode = node.children[0] as Element;
        const className = codeNode.properties?.className as string[] | undefined;
        
        if (className && className.includes('language-mermaid')) {
          // Mark this node as a mermaid diagram
          node.properties = node.properties || {};
          node.properties.dataType = 'mermaid';
        }
      }
    });
  };
};
