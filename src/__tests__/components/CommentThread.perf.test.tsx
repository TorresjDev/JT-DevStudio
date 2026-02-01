import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommentThread } from '@/components/ugc/CommentThread'
import type { CommentThread as CommentThreadType } from '@/lib/ugc'

// Mock dependencies
vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { src, alt, fill, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...rest} />
  }
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    loading: false
  })
}))

// Mock util functions
vi.mock('@/components/ugc/utils', () => ({
  formatDistanceToNow: () => '1 hour ago'
}))

// Mock CommentForm
vi.mock('@/components/ugc/CommentForm', () => ({
  CommentForm: () => <div data-testid="comment-form">Comment Form</div>
}))

describe('CommentThread', () => {
  const mockComment: CommentThreadType = {
    id: '1',
    content: 'Test comment content',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_id: 'test-author-id',
    post_id: 'post-1',
    parent_comment_id: null,
    author: {
      id: 'test-author-id',
      username: 'testuser',
      avatar_url: 'https://example.com/avatar.jpg',
      display_name: 'Test User'
    },
    replies: [
      {
        id: '2',
        content: 'Nested reply',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_id: 'other-author-id',
        post_id: 'post-1',
        parent_comment_id: '1',
        author: {
           id: 'other-author-id',
           username: 'other',
           avatar_url: null,
           display_name: 'Other User'
        },
        replies: []
      }
    ]
  }

  it('renders comment content and author', () => {
    render(
      <CommentThread
        comment={mockComment}
        postId="post-1"
      />
    )

    expect(screen.getByText('Test comment content')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Nested reply')).toBeInTheDocument()
    expect(screen.getByText('Other User')).toBeInTheDocument()
  })
})
