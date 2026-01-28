import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LandingPage from '@/app/page'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, unoptimized, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  },
}))

describe('LandingPage', () => {
  it('renders the welcome message', () => {
    render(<LandingPage />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/Welcome to my Dev Studio/i)
  })

  it('renders landing cards', () => {
    render(<LandingPage />)
    // "About Me" is in the hero and in the cards
    const aboutLinks = screen.getAllByText('About Me')
    expect(aboutLinks.length).toBeGreaterThan(0)

    expect(screen.getByText('Live Post Feed')).toBeInTheDocument()
  })
})
