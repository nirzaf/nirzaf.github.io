import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';

/**
 * A rehype plugin that fixes HTML attributes to be compatible with React's camelCase properties
 */
export const rehypeFixAttributes = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      // Fix iframe attributes
      if (node.tagName === 'iframe') {
        // Convert frameborder to frameBorder
        if (node.properties && 'frameborder' in node.properties) {
          node.properties.frameBorder = node.properties.frameborder;
          delete node.properties.frameborder;
        }
        
        // Convert allowfullscreen to allowFullScreen
        if (node.properties && 'allowfullscreen' in node.properties) {
          node.properties.allowFullScreen = true;
          delete node.properties.allowfullscreen;
        }
        
        // Convert marginheight to marginHeight
        if (node.properties && 'marginheight' in node.properties) {
          node.properties.marginHeight = node.properties.marginheight;
          delete node.properties.marginheight;
        }
        
        // Convert marginwidth to marginWidth
        if (node.properties && 'marginwidth' in node.properties) {
          node.properties.marginWidth = node.properties.marginwidth;
          delete node.properties.marginwidth;
        }
      }
    });
  };
};
