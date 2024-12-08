import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { remarkReadingTime } from './src/utils/readTime.ts'
import compress from 'astro-compress'

export default defineConfig({
	site: 'https://dotnetevangelist.com',
	trailingSlash: 'never',
	build: {
		inlineStylesheets: 'auto', // Automatically inline small stylesheets
		assets: 'assets', // Optimize asset handling
		splitting: true, // Enable code splitting
		redirects: true, // Generate 301 redirects for changed URLs
	},
	vite: {
		build: {
			cssCodeSplit: true,
			rollupOptions: {
				output: {
					manualChunks: {
						'motion': ['motion'],
						'mdx': ['@astrojs/mdx'],
					}
				}
			}
		},
		ssr: {
			noExternal: ['motion']
		}
	},
	markdown: {
		remarkPlugins: [remarkReadingTime],
		drafts: true,
		shikiConfig: {
			theme: 'material-theme-palenight',
			wrap: true,
			transformers: [] // Disable unnecessary transformers
		}
	},
	integrations: [
		mdx({
			syntaxHighlight: 'shiki',
			shikiConfig: {
				experimentalThemes: {
					light: 'vitesse-light',
					dark: 'material-theme-palenight',
				},
				wrap: true
			},
			drafts: true
		}),
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date()
		}),
		tailwind({
			applyBaseStyles: false // We'll handle base styles in our CSS
		}),
		compress({
			CSS: true,
			HTML: {
				removeAttributeQuotes: false
			},
			Image: false,
			JavaScript: true,
			SVG: true,
			Logger: 1
		})
	],
	outDir: './dist'
})