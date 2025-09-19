/**
 * @jest-environment jsdom
 */
import { LoanStatus } from '@/types/loan'

describe('Loan Filters Logic', () => {
  describe('Status filtering', () => {
    it('should filter loans by pending status', () => {
      const mockLoans = [
        { id: '1', status: LoanStatus.PENDING, borrowerName: 'John' },
        { id: '2', status: LoanStatus.APPROVED, borrowerName: 'Jane' },
        { id: '3', status: LoanStatus.PENDING, borrowerName: 'Bob' },
      ]

      const filtered = mockLoans.filter(loan => loan.status === LoanStatus.PENDING)
      
      expect(filtered).toHaveLength(2)
      expect(filtered[0].borrowerName).toBe('John')
      expect(filtered[1].borrowerName).toBe('Bob')
    })

    it('should filter loans by approved status', () => {
      const mockLoans = [
        { id: '1', status: LoanStatus.PENDING, borrowerName: 'John' },
        { id: '2', status: LoanStatus.APPROVED, borrowerName: 'Jane' },
        { id: '3', status: LoanStatus.APPROVED, borrowerName: 'Bob' },
      ]

      const filtered = mockLoans.filter(loan => loan.status === LoanStatus.APPROVED)
      
      expect(filtered).toHaveLength(2)
      expect(filtered.every(loan => loan.status === LoanStatus.APPROVED)).toBe(true)
    })
  })

  describe('Search filtering', () => {
    const mockLoans = [
      { 
        id: '1', 
        borrowerName: 'John Doe', 
        borrowerEmail: 'john@example.com',
        purpose: 'Home improvement'
      },
      { 
        id: '2', 
        borrowerName: 'Jane Smith', 
        borrowerEmail: 'jane@company.com',
        purpose: 'Car loan'
      },
      { 
        id: '3', 
        borrowerName: 'Bob Johnson', 
        borrowerEmail: 'bob@test.org',
        purpose: 'Business expansion'
      },
    ]

    it('should search loans by borrower name (case insensitive)', () => {
      const searchTerm = 'john'
      const filtered = mockLoans.filter(loan => 
        loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      expect(filtered).toHaveLength(2) // John Doe and Bob Johnson
      expect(filtered.find(loan => loan.borrowerName === 'John Doe')).toBeDefined()
      expect(filtered.find(loan => loan.borrowerName === 'Bob Johnson')).toBeDefined()
    })

    it('should search loans by email', () => {
      const searchTerm = 'company.com'
      const filtered = mockLoans.filter(loan => 
        loan.borrowerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].borrowerName).toBe('Jane Smith')
    })

    it('should search loans by purpose', () => {
      const searchTerm = 'business'
      const filtered = mockLoans.filter(loan => 
        loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].borrowerName).toBe('Bob Johnson')
    })

    it('should return empty array when no matches found', () => {
      const searchTerm = 'nonexistent'
      const filtered = mockLoans.filter(loan => 
        loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.borrowerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      expect(filtered).toHaveLength(0)
    })
  })

  describe('Combined filtering', () => {
    const mockLoans = [
      { 
        id: '1', 
        status: LoanStatus.PENDING,
        borrowerName: 'John Doe', 
        borrowerEmail: 'john@example.com',
        purpose: 'Home improvement'
      },
      { 
        id: '2', 
        status: LoanStatus.APPROVED,
        borrowerName: 'John Smith', 
        borrowerEmail: 'johnsmith@company.com',
        purpose: 'Car loan'
      },
      { 
        id: '3', 
        status: LoanStatus.PENDING,
        borrowerName: 'Bob Johnson', 
        borrowerEmail: 'bob@test.org',
        purpose: 'Business expansion'
      },
    ]

    it('should apply both status and search filters', () => {
      const searchTerm = 'john doe'
      const status = LoanStatus.PENDING

      const filtered = mockLoans.filter(loan => {
        const matchesSearch = 
          loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.borrowerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = loan.status === status

        return matchesSearch && matchesStatus
      })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].borrowerName).toBe('John Doe')
      expect(filtered[0].status).toBe(LoanStatus.PENDING)
    })
  })
})
