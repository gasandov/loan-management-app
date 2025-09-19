import { Navigation } from '@/components/layout/navigation';
import { render, screen } from '@testing-library/react';

// Mock Next.js modules
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

describe('Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the logo and brand name', () => {
    render(<Navigation />)
    
    expect(screen.getByText('Loan Management')).toBeDefined()
  })

  it('renders navigation links', () => {
    render(<Navigation />)
    
    expect(screen.getByText('Dashboard')).toBeDefined()
    expect(screen.getByText('Loans')).toBeDefined()
  })

  it('renders the New Loan button', () => {
    render(<Navigation />)
    
    expect(screen.getByText('New Loan')).toBeDefined()
  })

  it('has proper link hrefs', () => {
    render(<Navigation />)
    
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    const loansLink = screen.getByText('Loans').closest('a')
    const newLoanLink = screen.getByText('New Loan').closest('a')
    
    expect(dashboardLink?.getAttribute('href')).toBe('/')
    expect(loansLink?.getAttribute('href')).toBe('/loans')
    expect(newLoanLink?.getAttribute('href')).toBe('/loans/new')
  })

  // it('applies active styles to current page', () => {
  //   const { usePathname } = require('next/navigation')
  //   usePathname.mockReturnValue('/loans')
    
  //   render(<Navigation />)
    
  //   const loansLink = screen.getByText('Loans').closest('a')
  //   expect(loansLink?.className).toContain('bg-blue-100')
  // })

  // it('shows default styles for non-active links', () => {
  //   const { usePathname } = require('next/navigation')
  //   usePathname.mockReturnValue('/')
    
  //   render(<Navigation />)
    
  //   const loansLink = screen.getByText('Loans').closest('a')
  //   expect(loansLink?.className).toContain('text-gray-600')
  // })
})
