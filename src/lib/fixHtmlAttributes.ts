/**
 * Fixes HTML attributes in MDX content to be compatible with React's camelCase properties
 * This is particularly important for iframe attributes like frameborder and allowfullscreen
 */
export function fixHtmlAttributes(content: string): string {
  return content
    // Fix class attribute to className
    .replace(/ class=/g, ' className=')
    // Fix frameborder attribute
    .replace(/frameborder=/g, 'frameBorder=')
    // Fix allowfullscreen attribute (with or without value)
    .replace(/allowfullscreen(="[^"]*")?/g, 'allowFullScreen={true}')
    // Fix marginheight and marginwidth attributes
    .replace(/marginheight=/g, 'marginHeight=')
    .replace(/marginwidth=/g, 'marginWidth=')
    // Fix scrolling attribute
    .replace(/scrolling=/g, 'scrolling=');
}
