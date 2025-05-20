Here's your guideline formatted as a clean and structured Markdown file:

````md
# MDX Blog File Generation Guideline

To generate a new MDX article for this project, follow these steps:

---

## 1. File Location & Naming

- Place the new `.mdx` file in the `data/posts` directory.
- Use a descriptive, **kebab-case** filename related to your topic  
  _Example: `my-new-topic.mdx`_

---

## 2. Frontmatter Template

Each MDX file must start with a YAML frontmatter block containing the following fields:

```yaml
---
title: 'Your Article Title'
description: >-
  A brief summary of the article (1-2 lines, can be multi-line with `>-`).
pubDate: 'YYYY-MM-DD'
image: >-
  https://your-image-url.jpg
category: YourCategory
tags: ['tag1', 'tag2', ...]
---
````

### Explanation of Fields:

* `title`: Clear and concise article title.
* `description`: Short summary of the article's content.
* `pubDate`: Publication date in `YYYY-MM-DD` format.
* `image`: URL to a relevant cover image.
* `category`: Main category (e.g., `Csharp`, `Python`, `Web`, etc.).
* `tags`: Array of tags relevant to the topic.

---

## 3. Article Body

* Start with a level 2 heading (`##`) for the main article title.
* Write the article content using **Markdown** and **MDX** syntax.
* Use headings, code blocks, lists, and images as needed.
* Include relevant and working code examples.
* Maintain a clear, instructional, and engaging tone.

---

## Example Structure

````mdx
---
title: 'Your Article Title'
description: >-
  Brief summary of the article.
pubDate: '2025-05-12'
image: >-
  https://your-image-url.jpg
category: YourCategory
tags: ['tag1', 'tag2']
---

## Your Article Title

Introductory paragraph about the topic.

### Subheading

Further explanation, examples, or code:

```python   
  // your python code here
```

```csharp  
  // your C# code here
```

Continue with more sections as needed.
