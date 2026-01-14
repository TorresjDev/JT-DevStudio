import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { CommentsSection } from '../CommentThread'
import type { CommentThread } from '@/lib/ugc'

// Mock useAuth
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'test@example.com' },
    loading: false,
    hasMounted: true,
  }),
}))

// Mock deleteComment
vi.mock('@/lib/ugc', async () => {
  const actual = await vi.importActual('@/lib/ugc') as Record<string, unknown>
  return {
    ...actual,
    deleteComment: vi.fn(),
  }
})

// Mock utils
vi.mock('../utils', async () => {
  const actual = await vi.importActual('../utils') as Record<string, unknown>
  return {
    ...actual,
    formatDistanceToNow: () => '1 hour ago',
  }
})

// Mock next/image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt || ''} />,
}))

// Mock CommentForm
vi.mock('../CommentForm', () => ({
  CommentForm: () => <div data-testid="comment-form">Form</div>,
}))

const mockComments: CommentThread[] = [
  {
    id: 'c1',
    post_id: 'p1',
    author_id: 'u2',
    parent_comment_id: null,
    content: 'Top level comment 1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: { id: 'u2', username: 'user2', display_name: 'User 2', avatar_url: null },
    replies: [
      {
        id: 'c1-r1',
        post_id: 'p1',
        author_id: 'u3',
        parent_comment_id: 'c1',
        content: 'Reply 1 to C1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: { id: 'u3', username: 'user3', display_name: 'User 3', avatar_url: null },
        replies: []
      }
    ]
  },
  {
    id: 'c2',
    post_id: 'p1',
    author_id: 'u4',
    parent_comment_id: null,
    content: 'Top level comment 2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: { id: 'u4', username: 'user4', display_name: 'User 4', avatar_url: null },
    replies: []
  }
]

describe('CommentThread', () => {
  it('renders comments and nested replies', () => {
    const { rerender } = render(<CommentsSection postId="p1" comments={mockComments} />)

    expect(screen.getByText('Top level comment 1')).toBeDefined()
    expect(screen.getByText('Reply 1 to C1')).toBeDefined()
    expect(screen.getByText('Top level comment 2')).toBeDefined()

    // Trigger re-render with same props
    rerender(<CommentsSection postId="p1" comments={mockComments} />)
  })
})
