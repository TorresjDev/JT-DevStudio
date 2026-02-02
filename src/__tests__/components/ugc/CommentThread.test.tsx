import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { CommentThread } from '@/components/ugc/CommentThread'
import type { CommentThread as CommentThreadType } from '@/lib/ugc'

// Mock useAuth
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    hasMounted: true,
  }),
}))

// Mock next/image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ src, alt, fill: _fill, ...props }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = _fill
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

// Mock formatDistanceToNow
vi.mock('@/components/ugc/utils', () => ({
  formatDistanceToNow: () => 'just now',
}))

// Mock deleteComment server action
vi.mock('@/lib/ugc', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/ugc')>()
  return {
    ...actual,
    deleteComment: vi.fn(),
  }
})

describe('CommentThread', () => {
  const mockComment: CommentThreadType = {
    id: 'c1',
    post_id: 'p1',
    author_id: 'u1',
    parent_comment_id: null,
    content: 'This is a comment',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: {
      id: 'u1',
      username: 'user1',
      display_name: 'User One',
      avatar_url: null,
    },
    replies: [
      {
        id: 'c2',
        post_id: 'p1',
        author_id: 'u2',
        parent_comment_id: 'c1',
        content: 'This is a reply',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: {
          id: 'u2',
          username: 'user2',
          display_name: 'User Two',
          avatar_url: null,
        },
        replies: [],
      },
    ],
  }

  it('renders comment content and replies', () => {
    render(<CommentThread comment={mockComment} postId="p1" />)

    expect(screen.getByText('This is a comment')).toBeDefined()
    expect(screen.getByText('User One')).toBeDefined()

    // Check reply
    expect(screen.getByText('This is a reply')).toBeDefined()
    expect(screen.getByText('User Two')).toBeDefined()
  })
})
