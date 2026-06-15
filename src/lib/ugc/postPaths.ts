import type { PostCategory } from './types'

/** List page for a post category (blogs/tutorials share the blog feed). */
export function getPostListPath(category: PostCategory): string {
	if (category === 'blog') return '/posts/blogs'
	return '/posts'
}

/** Singular label for UI copy (e.g. delete confirmation). */
export function getPostTypeLabel(category: PostCategory): string {
	switch (category) {
		case 'blog':
			return 'blog post'
		case 'discussion':
			return 'discussion'
		default:
			return 'post'
	}
}
