---
trigger: always_on
---

{{---
trigger: always_on
---}}

# MDX Article Guideline

This guideline provides a consistent structure and style for creating new MDX blog posts based on existing articles in `src/content/blog`.

## 1. File Naming & Location
- Place new articles in `src/content/blog/`.
- Use lowercase, kebab-case filenames, e.g. `how-to-your-topic.mdx`.

## 2. Frontmatter (YAML)
- Required fields:
  - `title`: A concise, descriptive title in quotes.
  - `description`: A short summary (50–160 characters).
  - `pubDate`: Formatted as `"MMM DD YYYY"`.
  - `heroImage`: Relative path to a header image.
- Example:
  ```yaml
  ---
  title: "How to Your Topic"
  description: "Brief summary of what the article covers."
  pubDate: "May 09 2025"
  heroImage: "../../assets/images/your-image.jpg"
  ---
  ```

## 3. Article Structure
1. **Introduction**: Briefly introduce the problem or topic.
2. **Step-by-Step Guide**: Use headings (`###`) for each major step.
3. **Code Snippets & Images**: Use fenced code blocks for code and markdown `![]()` or `<Figure>` component for images.
4. **Tips & Troubleshooting**: Use bullet lists for common issues.
5. **Conclusion**: Summarize key takeaways and next steps.
6. **Optional Video**: Embed videos using the aspect-ratio wrapper:
   ```jsx
   <div className="aspect-w-16 aspect-h-9 my-6">
     <iframe
       width="100%"
       height="480"
       src="https://www.youtube.com/embed/VIDEO_ID"
       title="Video Title"
       frameBorder="0"
       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
       allowFullScreen
       className="w-full h-full rounded-lg shadow-lg"
     />
   </div>
   ```

## 4. Writing Style & Tone
- Write in second person ("you").
- Keep paragraphs concise.
- Use markdown lists and **bold** for emphasis.
- Maintain consistent voice across posts.

## 5. SEO & Accessibility
- Use descriptive headings with keywords.
- Add `alt` text for images.
- Link to related articles using `[Link text](/path)`.
