import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CommentThread, CommentsSection } from '@/components/ugc/CommentThread'
import type { CommentThread as CommentThreadType } from '@/lib/ugc'

// Mock dependencies
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'test@example.com' },
    isAdmin: false
  })
}))

vi.mock('@/lib/ugc', () => ({
  deleteComment: vi.fn(),
  formatDistanceToNow: () => '1h ago'
}))

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  }
}))

// Mock CommentForm to simplify testing
vi.mock('@/components/ugc/CommentForm', () => ({
  CommentForm: () => <div data-testid="comment-form">Comment Form</div>
}))

// Sample data
const mockAuthor = {
  id: 'user-1',
  username: 'testuser',
  display_name: 'Test User',
  avatar_url: 'https://example.com/avatar.jpg'
}

const mockComment: CommentThreadType = {
  id: 'comment-1',
  post_id: 'post-1',
  author_id: 'user-1',
  content: 'This is a test comment',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  author: mockAuthor,
  replies: []
}

const mockReply: CommentThreadType = {
  id: 'reply-1',
  post_id: 'post-1',
  author_id: 'user-2',
  content: 'This is a reply',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  author: { ...mockAuthor, id: 'user-2', username: 'replier' },
  replies: []
}

const mockCommentWithReplies: CommentThreadType = {
  ...mockComment,
  replies: [mockReply]
}

describe('CommentThread', () => {
  it('renders a comment correctly', () => {
    render(<CommentThread comment={mockComment} postId="post-1" />)

    expect(screen.getByText('This is a test comment')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('renders nested replies', () => {
    render(<CommentThread comment={mockCommentWithReplies} postId="post-1" />)

    expect(screen.getByText('This is a test comment')).toBeInTheDocument()
    expect(screen.getByText('This is a reply')).toBeInTheDocument()
  })

  it('shows reply button', () => {
    render(<CommentThread comment={mockComment} postId="post-1" />)

    const replyButton = screen.getByText('Reply')
    expect(replyButton).toBeInTheDocument()

    fireEvent.click(replyButton)
    expect(screen.getByTestId('comment-form')).toBeInTheDocument()
  })
})

describe('CommentsSection', () => {
  it('renders list of comments', () => {
    const comments = [mockComment, { ...mockComment, id: 'comment-2', content: 'Second comment' }]
    render(<CommentsSection postId="post-1" comments={comments} />)

    expect(screen.getByText('Comments (2)')).toBeInTheDocument()
    expect(screen.getByText('This is a test comment')).toBeInTheDocument()
    expect(screen.getByText('Second comment')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<CommentsSection postId="post-1" comments={[]} />)

    expect(screen.getByText(/No comments yet/)).toBeInTheDocument()
  })
})
