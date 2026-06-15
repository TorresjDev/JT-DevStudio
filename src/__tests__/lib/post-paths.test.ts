import { describe, it, expect } from 'vitest'
import { getPostListPath, getPostTypeLabel } from '@/lib/ugc/postPaths'

describe('postPaths', () => {
	it('routes blogs to the blogs feed', () => {
		expect(getPostListPath('blog')).toBe('/posts/blogs')
	})

	it('routes other categories to the main posts feed', () => {
		expect(getPostListPath('post')).toBe('/posts')
		expect(getPostListPath('discussion')).toBe('/posts')
	})

	it('uses category-specific labels in UI copy', () => {
		expect(getPostTypeLabel('blog')).toBe('blog post')
		expect(getPostTypeLabel('post')).toBe('post')
	})
})
