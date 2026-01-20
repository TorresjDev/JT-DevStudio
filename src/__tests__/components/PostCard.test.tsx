import { render, screen } from '@testing-library/react'
import { PostCard } from '@/components/ugc/PostCard'
import type { PostWithAuthor } from '@/lib/ugc'
import { vi, describe, it, expect } from 'vitest'

// Mock Image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ src, alt, fill, ...props }: any) => <img src={src} alt={alt} {...props} />
}))

const mockPost: PostWithAuthor = {
  id: '1',
  title: 'Test Post',
  content: 'This is a test content',
  category: 'discussion',
  status: 'published',
  author_id: 'user1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  author: {
    id: 'user1',
    username: 'testuser',
    display_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg'
  },
  reactions: [],
  reaction_count: 0,
  comment_count: 0,
  tags: [],
  views: 0
}

describe('PostCard', () => {
  it('renders post title and author', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})
