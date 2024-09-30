import { getCollection } from 'astro:content'

export const getCategories = async () => {
	const posts = await getCollection('blog')
	const categories = new Set(
		posts.filter((post: any) => !post.data.draft).map((post: any) => post.data.category)
	)
	return Array.from(categories)
}

export const getPosts = async (max?: number) => {
	return (await getCollection('blog'))
		.filter((post: any) => !post.data.draft)
		.sort((a: any, b: any) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.slice(0, max)
}

export const getTags = async () => {
	const posts = await getCollection('blog')
	const tags = new Set()
	posts
		.filter((post: any) => !post.data.draft)
		.forEach((post: any) => {
			post.data.tags.forEach((tag: any) => {
				tags.add(tag.toLowerCase().replace(/[^a-z0-9]/g, '-'))
			})
		})

	return Array.from(tags)
}

export const getPostByTag = async (tag: string) => {
	const posts = await getPosts()
	const lowercaseTag = tag.toLowerCase()
	return posts
		.filter((post: any) => !post.data.draft)
		.filter((post: any) => {
			return post.data.tags.some((postTag: any) => postTag.toLowerCase() === lowercaseTag)
		})
}

export const filterPostsByCategory = async (category: string) => {
	const posts = await getPosts()
	return posts
		.filter((post: any) => !post.data.draft)
		.filter((post: any) => post.data.category.toLowerCase() === category)
}
