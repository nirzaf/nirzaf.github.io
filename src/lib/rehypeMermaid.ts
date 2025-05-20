import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to process Mermaid code blocks
 */
export const rehypeMermaid = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      // Find code elements with language-mermaid class
      if (
        node.tagName === 'pre' &&
        node.children &&
        node.children.length === 1 &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        const codeNode = node.children[0];
        const className = Array.isArray(codeNode.properties?.className) 
          ? codeNode.properties.className 
          : [];
        
        if (className.includes('language-mermaid')) {
          // Mark this node as a mermaid diagram
          node.properties = node.properties || {};
          node.properties.dataType = 'mermaid';
        }
      }
    });
  };
};
