import { render, screen } from '@testing-library/react'
import { CommentThread } from '@/components/ugc/CommentThread'
import { vi, describe, it, expect } from 'vitest'

// Mock dependencies
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user' } }),
}))

vi.mock('@/lib/ugc', () => ({
  deleteComment: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

vi.mock('@/components/ugc/utils', () => ({
  formatDistanceToNow: () => '2 hours ago',
}))

// Mock CommentForm to avoid complex dependencies
vi.mock('@/components/ugc/CommentForm', () => ({
  CommentForm: () => <div data-testid="comment-form">Comment Form</div>,
}))

describe('CommentThread', () => {
  const mockComment = {
    id: '1',
    content: 'Test comment',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_id: 'test-user',
    author: {
      username: 'testuser',
      avatar_url: '/avatar.png',
    },
    replies: [],
  }

  it('renders comment content', () => {
    render(
      <CommentThread
        comment={mockComment as any}
        postId="post-1"
      />
    )
    expect(screen.getByText('Test comment')).toBeDefined()
    expect(screen.getByText('testuser')).toBeDefined()
  })

  it('renders nested replies', () => {
    const commentWithReplies = {
      ...mockComment,
      replies: [
        {
          ...mockComment,
          id: '2',
          content: 'Reply comment',
        }
      ]
    }

    render(
      <CommentThread
        comment={commentWithReplies as any}
        postId="post-1"
      />
    )

    expect(screen.getByText('Test comment')).toBeDefined()
    expect(screen.getByText('Reply comment')).toBeDefined()
  })
})
