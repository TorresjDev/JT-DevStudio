import { describe, it, expect } from 'vitest'
import { isPostAuthor } from '@/lib/ugc/postOwnership'

describe('postOwnership', () => {
	it('allows only the post author', () => {
		const authorId = 'user-abc'
		expect(isPostAuthor(authorId, authorId)).toBe(true)
	})

	it('denies other users, guests, and missing ids', () => {
		const authorId = 'user-abc'
		expect(isPostAuthor('user-xyz', authorId)).toBe(false)
		expect(isPostAuthor(null, authorId)).toBe(false)
		expect(isPostAuthor(undefined, authorId)).toBe(false)
	})
})
