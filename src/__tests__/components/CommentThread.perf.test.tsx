import { render, screen } from '@testing-library/react'
import { CommentThread } from '@/components/ugc/CommentThread'
import { vi, describe, it, expect } from 'vitest'
import type { CommentThread as CommentThreadType } from '@/lib/ugc'

// Mocks
vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  default: ({ fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  }
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'test@example.com' }
  })
}))

vi.mock('@/lib/ugc', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/ugc')>()
  return {
    ...actual,
    deleteComment: vi.fn().mockResolvedValue({ success: true }),
  }
})

vi.mock('@/components/ugc/CommentForm', () => ({
  CommentForm: () => <div data-testid="comment-form">CommentForm</div>
}))

// Utils mock
vi.mock('@/components/ugc/utils', () => ({
  formatDistanceToNow: () => '2 hours ago'
}))

describe('CommentThread', () => {
  const mockAuthor = {
    id: 'user-1',
    username: 'tester',
    display_name: 'Tester',
    avatar_url: 'http://example.com/avatar.jpg'
  }

  const mockComment: CommentThreadType = {
    id: 'c1',
    post_id: 'p1',
    author_id: 'user-1',
    parent_comment_id: null,
    content: 'This is a test comment',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockAuthor,
    replies: []
  }

  it('renders comment content correctly', () => {
    render(
      <CommentThread
        comment={mockComment}
        postId="p1"
      />
    )

    expect(screen.getByText('This is a test comment')).toBeInTheDocument()
    expect(screen.getByText('Tester')).toBeInTheDocument()
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
  })

  it('renders nested replies', () => {
    const commentWithReply: CommentThreadType = {
      ...mockComment,
      replies: [
        {
          ...mockComment,
          id: 'c2',
          content: 'This is a reply',
          replies: []
        }
      ]
    }

    render(
      <CommentThread
        comment={commentWithReply}
        postId="p1"
      />
    )

    expect(screen.getByText('This is a test comment')).toBeInTheDocument()
    expect(screen.getByText('This is a reply')).toBeInTheDocument()
  })
})
