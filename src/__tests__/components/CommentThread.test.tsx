import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CommentThread } from '@/components/ugc/CommentThread'
import type { CommentThread as CommentThreadType } from '@/lib/ugc'

// Mock dependencies
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  )
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'user-1' } // Default mock: authenticated user
  }))
}))

// Mock specific exports from '@/lib/ugc' but keep types
vi.mock('@/lib/ugc', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/ugc')>()
  return {
    ...actual,
    deleteComment: vi.fn(),
  }
})

// Mock utils if needed, but CommentThread imports formatDistanceToNow from './utils' locally
vi.mock('@/components/ugc/utils', () => ({
  formatDistanceToNow: () => '1 hour ago'
}))

// Mock CommentForm to avoid complex sub-component rendering
vi.mock('@/components/ugc/CommentForm', () => ({
  CommentForm: () => <div data-testid="comment-form">Comment Form</div>
}))

describe('CommentThread', () => {
  const mockComment: CommentThreadType = {
    id: 'comment-1',
    post_id: 'post-1',
    author_id: 'user-1',
    parent_comment_id: null,
    content: 'This is a test comment',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: {
      id: 'user-1',
      username: 'testuser',
      display_name: 'Test User',
      avatar_url: '/avatar.jpg'
    },
    replies: []
  }

  it('renders comment content and author', () => {
    render(<CommentThread comment={mockComment} postId="post-1" />)

    expect(screen.getByText('This is a test comment')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('shows reply/edit/delete buttons for the author', () => {
    render(<CommentThread comment={mockComment} postId="post-1" />)

    expect(screen.getByText('Reply')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('toggles reply form when Reply button is clicked', () => {
    render(<CommentThread comment={mockComment} postId="post-1" />)

    const replyBtn = screen.getByText('Reply')
    fireEvent.click(replyBtn)

    expect(screen.getByTestId('comment-form')).toBeInTheDocument()

    // Toggle off
    fireEvent.click(replyBtn)
    expect(screen.queryByTestId('comment-form')).not.toBeInTheDocument()
  })
})
