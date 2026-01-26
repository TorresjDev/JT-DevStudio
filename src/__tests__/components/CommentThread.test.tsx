import { render, screen, fireEvent } from '@testing-library/react'
import { CommentThread } from '@/components/ugc/CommentThread'
import { vi, describe, it, expect } from 'vitest'

// Mock dependencies
vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  }
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'current-user-id', email: 'test@example.com' },
    loading: false
  })
}))

vi.mock('@/lib/ugc', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/ugc')>()
  return {
    ...actual,
    deleteComment: vi.fn().mockResolvedValue({ success: true }),
  }
})

// Mock formatDistanceToNow to return stable string
vi.mock('@/components/ugc/utils', () => ({
  formatDistanceToNow: () => '2 hours ago'
}))

// Mock CommentForm
vi.mock('@/components/ugc/CommentForm', () => ({
  CommentForm: () => <div data-testid="comment-form">Comment Form</div>
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockComment: any = {
  id: 'comment-1',
  post_id: 'post-1',
  author_id: 'author-1',
  parent_comment_id: null,
  content: 'This is a test comment',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  author: {
    id: 'author-1',
    username: 'testuser',
    display_name: 'Test User',
    avatar_url: null
  },
  replies: []
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockCommentWithReplies: any = {
  ...mockComment,
  replies: [
    {
      ...mockComment,
      id: 'reply-1',
      parent_comment_id: 'comment-1',
      content: 'This is a reply',
      replies: []
    }
  ]
}

describe('CommentThread', () => {
  it('renders a comment', () => {
    render(<CommentThread comment={mockComment} postId="post-1" />)
    expect(screen.getByText('This is a test comment')).toBeDefined()
    expect(screen.getByText('Test User')).toBeDefined()
  })

  it('renders nested replies', () => {
    render(<CommentThread comment={mockCommentWithReplies} postId="post-1" />)
    expect(screen.getByText('This is a test comment')).toBeDefined()
    expect(screen.getByText('This is a reply')).toBeDefined()
  })

  it('shows reply button for logged in user', () => {
    render(<CommentThread comment={mockComment} postId="post-1" />)
    const replyButton = screen.getByText('Reply')
    expect(replyButton).toBeDefined()

    fireEvent.click(replyButton)
    expect(screen.getByTestId('comment-form')).toBeDefined()
  })
})
