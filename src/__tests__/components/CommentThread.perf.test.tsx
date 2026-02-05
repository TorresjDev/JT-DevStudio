import { render, fireEvent, screen } from '@testing-library/react'
import { vi, describe, it, expect, afterEach } from 'vitest'
import { CommentThread } from '@/components/ugc/CommentThread'

// Mock dependencies
const mockUseAuth = vi.fn(() => ({
  user: { id: 'user-1', username: 'tester' },
  loading: false
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}))

vi.mock('@/lib/ugc', () => ({
  deleteComment: vi.fn(),
}))

// Mock CommentForm component to avoid its internal logic/renders interfering
vi.mock('@/components/ugc/CommentForm', () => ({
  CommentForm: () => <div data-testid="comment-form">Comment Form</div>
}))

// We use formatDistanceToNow as a proxy to count renders of the CommentThread component
// since it is called directly in the render body.
const mockFormatDistanceToNow = vi.fn(() => '2 hours ago')

vi.mock('@/components/ugc/utils', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatDistanceToNow: (...args: any[]) => mockFormatDistanceToNow(...args),
  formatDate: vi.fn(),
  formatDateTime: vi.fn(),
}))

vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  default: ({ fill: _fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />
  }
}))

describe('CommentThread Performance', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should not re-render child comments when parent state updates', () => {
    const childComment = {
      id: 'child-1',
      content: 'Child comment',
      author_id: 'user-2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: { username: 'other', avatar_url: null },
      replies: []
    }

    const parentComment = {
      id: 'parent-1',
      content: 'Parent comment',
      author_id: 'user-3',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: { username: 'parent-author', avatar_url: null },
      replies: [childComment]
    }

    render(
      <CommentThread
        comment={parentComment}
        postId="post-1"
      />
    )

    // Initial render: Parent + Child = 2 calls
    expect(mockFormatDistanceToNow).toHaveBeenCalledTimes(2)

    // Clear mocks to measure update renders only
    mockFormatDistanceToNow.mockClear()

    // Trigger state update on Parent by clicking "Reply"
    const replyButtons = screen.getAllByText('Reply')
    fireEvent.click(replyButtons[0]) // Click parent's reply button

    // Assert expectation:
    // Without memoization: Parent updates (1) + Child updates (1) = 2 calls
    // With memoization: Parent updates (1) + Child skips update (0) = 1 call

    // We assert 1 call to enforce the optimization
    expect(mockFormatDistanceToNow).toHaveBeenCalledTimes(1)
  })
})
