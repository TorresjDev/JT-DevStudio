import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommentThread } from '@/components/ugc/CommentThread'
import type { CommentThread as CommentThreadType } from '@/lib/ugc'

// Mock dependencies
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'user1', email: 'test@example.com' },
    loading: false,
    hasMounted: true,
  })),
}))

vi.mock('@/lib/ugc', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/ugc')>()
  return {
    ...actual,
    deleteComment: vi.fn().mockResolvedValue({ success: true }),
  }
})

// Mock Image component to avoid issues
vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ src, alt, fill, ...props }: { src: string; alt: string; fill?: boolean; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

describe('CommentThread', () => {
  const mockComment: CommentThreadType = {
    id: 'c1',
    post_id: 'p1',
    author_id: 'user1',
    parent_comment_id: null,
    content: 'Test comment content',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: {
      id: 'user1',
      username: 'tester',
      display_name: 'Tester',
      avatar_url: 'https://example.com/avatar.jpg'
    },
    replies: [
      {
        id: 'c2',
        post_id: 'p1',
        author_id: 'user2',
        parent_comment_id: 'c1',
        content: 'Nested reply content',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: {
            id: 'user2',
            username: 'replier',
            display_name: 'Replier',
            avatar_url: null
        },
        replies: []
      }
    ]
  }

  it('renders comment content and author', () => {
    render(<CommentThread comment={mockComment} postId="p1" />)

    expect(screen.getByText('Test comment content')).toBeInTheDocument()
    expect(screen.getByText('Tester')).toBeInTheDocument()
  })

  it('renders nested replies recursively', () => {
    render(<CommentThread comment={mockComment} postId="p1" />)

    expect(screen.getByText('Nested reply content')).toBeInTheDocument()
    expect(screen.getByText('Replier')).toBeInTheDocument()
  })
})
