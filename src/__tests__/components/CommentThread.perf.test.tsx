import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { CommentThread } from '@/components/ugc/CommentThread'

// Mock useAuth
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'test@example.com' },
    loading: false,
  }),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

// Mock @/lib/ugc
vi.mock('@/lib/ugc', () => ({
  deleteComment: vi.fn().mockResolvedValue({ success: true }),
  formatDistanceToNow: () => '1h ago',
}))

// Mock utils
vi.mock('@/components/ugc/utils', () => ({
  formatDistanceToNow: () => '1h ago',
}))

const mockComment = {
  id: 'comment-1',
  post_id: 'post-1',
  author_id: 'user-2',
  parent_comment_id: null,
  content: 'This is a test comment',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  author: {
    id: 'user-2',
    username: 'testuser',
    display_name: 'Test User',
    avatar_url: null,
  },
  replies: [],
}

describe('CommentThread Performance', () => {
  it('should be a memoized component to prevent unnecessary re-renders', () => {
    // Verify that the exported component is wrapped in React.memo
    // We check the Symbol directly as react-is can have version mismatches in test env
    // @ts-expect-error - $$typeof is internal
    const typeSymbol = CommentThread.$$typeof
    expect(typeSymbol.toString()).toContain('react.memo')
  })

  it('should render correctly', () => {
    const { getByText } = render(
      <CommentThread
        comment={mockComment}
        postId="post-1"
      />
    )
    expect(getByText('This is a test comment')).toBeInTheDocument()
    expect(getByText('Test User')).toBeInTheDocument()
  })
})
