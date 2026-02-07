import { render, act, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { useState, memo } from 'react'
import { vi, describe, it, expect, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => {
  return {
    getUser: vi.fn(),
    unsubscribe: vi.fn(),
    onAuthStateChange: vi.fn(),
  }
})

vi.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mocks.getUser,
      onAuthStateChange: mocks.onAuthStateChange,
    },
  }),
}))

describe('AuthContext Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null })
    mocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mocks.unsubscribe } }
    })
  })

  it('prevents unnecessary consumer re-renders when parent re-renders', async () => {
    let renderCount = 0

    const Consumer = memo(function Consumer() {
      useAuth()
      renderCount++
      return <div>Consumer</div>
    })

    const TestApp = () => {
      const [, setCount] = useState(0)
      return (
        <div data-testid="app">
          <button onClick={() => setCount(c => c + 1)}>Re-render Parent</button>
          <AuthProvider>
            <Consumer />
          </AuthProvider>
        </div>
      )
    }

    render(<TestApp />)

    await screen.findByText('Consumer')

    const countAfterMount = renderCount
    console.log(`Initial count: ${countAfterMount}`)

    const button = screen.getByText('Re-render Parent')
    await act(async () => {
        button.click()
    })

    console.log(`Final count: ${renderCount}`)

    // This assertion is what we WANT to happen after optimization.
    // If it fails now, it confirms the issue.
    expect(renderCount).toBe(countAfterMount)
  })
})
