import { render } from '@testing-library/react'
import { CommentThread } from '@/components/ugc/CommentThread'
import { useAuth } from '@/context/AuthContext'
import { vi, describe, it, expect } from 'vitest'
import type { CommentThread as CommentThreadType } from '@/lib/ugc'

// Mock dependencies
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element
  default: ({ fill, ...props }: any) => <img {...props} alt={props.alt} />
}))

vi.mock('next/link', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children }: any) => children
}))

// Mock imports used in CommentThread
vi.mock('@/lib/ugc', () => ({
  deleteComment: vi.fn(),
}))

vi.mock('@/components/ugc/utils', () => ({
  formatDistanceToNow: () => '1 min ago'
}))

vi.mock('@/components/ugc/CommentForm', () => ({
  CommentForm: () => <div data-testid="comment-form" />
}))

describe('CommentThread Performance', () => {
  it('prevents re-render when props are stable (memoization)', () => {
    const mockUseAuth = vi.mocked(useAuth)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockUseAuth.mockReturnValue({ user: { id: 'user1' } } as any)
    mockUseAuth.mockClear()

    const comment: CommentThreadType = {
      id: 'c1',
      content: 'Hello',
      author_id: 'user1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      replies: [],
      author: {
        id: 'user1', // Added id to match typical profile type
        username: 'user1',
        display_name: 'User 1',
        avatar_url: 'http://example.com/avatar.jpg',
        website: null,
        bio: null,
        created_at: '',
        updated_at: ''
      },
      post_id: 'p1',
      parent_comment_id: null
    }

    const { rerender } = render(
      <CommentThread comment={comment} postId="p1" />
    )

    // Initial render
    expect(mockUseAuth).toHaveBeenCalledTimes(1)

    // Rerender with SAME props object (reference equality)
    rerender(
      <CommentThread comment={comment} postId="p1" />
    )

    // With memoization, it should NOT re-render
    expect(mockUseAuth).toHaveBeenCalledTimes(1)
  })
})
