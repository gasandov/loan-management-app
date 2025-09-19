/**
 * @jest-environment jsdom
 */
import { LoanStatus } from '@/types/loan'

describe('Loan Table Sorting', () => {
  const mockLoans = [
    {
      id: '1',
      borrowerName: 'Charlie Brown',
      amount: 15000,
      createdAt: new Date('2024-01-15'),
      status: LoanStatus.APPROVED,
      interestRate: 5.5
    },
    {
      id: '2',
      borrowerName: 'Alice Johnson',
      amount: 25000,
      createdAt: new Date('2024-01-10'),
      status: LoanStatus.PENDING,
      interestRate: 4.5
    },
    {
      id: '3',
      borrowerName: 'Bob Smith',
      amount: 10000,
      createdAt: new Date('2024-01-20'),
      status: LoanStatus.REJECTED,
      interestRate: 6.0
    }
  ]

  describe('Sort by borrower name', () => {
    it('should sort borrower names in ascending order', () => {
      const sorted = [...mockLoans].sort((a, b) => 
        a.borrowerName.localeCompare(b.borrowerName)
      )

      expect(sorted[0].borrowerName).toBe('Alice Johnson')
      expect(sorted[1].borrowerName).toBe('Bob Smith')
      expect(sorted[2].borrowerName).toBe('Charlie Brown')
    })

    it('should sort borrower names in descending order', () => {
      const sorted = [...mockLoans].sort((a, b) => 
        b.borrowerName.localeCompare(a.borrowerName)
      )

      expect(sorted[0].borrowerName).toBe('Charlie Brown')
      expect(sorted[1].borrowerName).toBe('Bob Smith')
      expect(sorted[2].borrowerName).toBe('Alice Johnson')
    })
  })

  describe('Sort by amount', () => {
    it('should sort amounts in ascending order', () => {
      const sorted = [...mockLoans].sort((a, b) => a.amount - b.amount)

      expect(sorted[0].amount).toBe(10000)
      expect(sorted[1].amount).toBe(15000)
      expect(sorted[2].amount).toBe(25000)
    })

    it('should sort amounts in descending order', () => {
      const sorted = [...mockLoans].sort((a, b) => b.amount - a.amount)

      expect(sorted[0].amount).toBe(25000)
      expect(sorted[1].amount).toBe(15000)
      expect(sorted[2].amount).toBe(10000)
    })
  })

  describe('Sort by date', () => {
    it('should sort dates in ascending order (oldest first)', () => {
      const sorted = [...mockLoans].sort((a, b) => 
        a.createdAt.getTime() - b.createdAt.getTime()
      )

      expect(sorted[0].createdAt.toISOString().split('T')[0]).toBe('2024-01-10')
      expect(sorted[1].createdAt.toISOString().split('T')[0]).toBe('2024-01-15')
      expect(sorted[2].createdAt.toISOString().split('T')[0]).toBe('2024-01-20')
    })

    it('should sort dates in descending order (newest first)', () => {
      const sorted = [...mockLoans].sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      )

      expect(sorted[0].createdAt.toISOString().split('T')[0]).toBe('2024-01-20')
      expect(sorted[1].createdAt.toISOString().split('T')[0]).toBe('2024-01-15')
      expect(sorted[2].createdAt.toISOString().split('T')[0]).toBe('2024-01-10')
    })
  })

  describe('Sort by status', () => {
    it('should sort by status alphabetically', () => {
      const sorted = [...mockLoans].sort((a, b) => 
        a.status.localeCompare(b.status)
      )

      expect(sorted[0].status).toBe(LoanStatus.APPROVED)
      expect(sorted[1].status).toBe(LoanStatus.PENDING)
      expect(sorted[2].status).toBe(LoanStatus.REJECTED)
    })

    it('should sort by status priority (pending first)', () => {
      const statusPriority = {
        [LoanStatus.PENDING]: 1,
        [LoanStatus.APPROVED]: 2,
        [LoanStatus.REJECTED]: 3,
        [LoanStatus.ACTIVE]: 4,
        [LoanStatus.PAID_OFF]: 5,
        [LoanStatus.DEFAULTED]: 6
      }

      const sorted = [...mockLoans].sort((a, b) => 
        statusPriority[a.status] - statusPriority[b.status]
      )

      expect(sorted[0].status).toBe(LoanStatus.PENDING)
      expect(sorted[1].status).toBe(LoanStatus.APPROVED)
      expect(sorted[2].status).toBe(LoanStatus.REJECTED)
    })
  })

  describe('Sort by interest rate', () => {
    it('should sort interest rates in ascending order', () => {
      const sorted = [...mockLoans].sort((a, b) => a.interestRate - b.interestRate)

      expect(sorted[0].interestRate).toBe(4.5)
      expect(sorted[1].interestRate).toBe(5.5)
      expect(sorted[2].interestRate).toBe(6.0)
    })

    it('should sort interest rates in descending order', () => {
      const sorted = [...mockLoans].sort((a, b) => b.interestRate - a.interestRate)

      expect(sorted[0].interestRate).toBe(6.0)
      expect(sorted[1].interestRate).toBe(5.5)
      expect(sorted[2].interestRate).toBe(4.5)
    })
  })

  describe('Multi-level sorting', () => {
    const extendedMockLoans = [
      ...mockLoans,
      {
        id: '4',
        borrowerName: 'Alice Johnson',
        amount: 30000,
        createdAt: new Date('2024-01-05'),
        status: LoanStatus.APPROVED,
        interestRate: 5.0
      }
    ]

    it('should sort by status first, then by amount', () => {
      const sorted = [...extendedMockLoans].sort((a, b) => {
        // First by status
        const statusCompare = a.status.localeCompare(b.status)
        if (statusCompare !== 0) return statusCompare
        
        // Then by amount
        return b.amount - a.amount
      })

      // First two should be APPROVED status, with higher amount first
      expect(sorted[0].status).toBe(LoanStatus.APPROVED)
      expect(sorted[0].amount).toBe(30000)
      expect(sorted[1].status).toBe(LoanStatus.APPROVED)
      expect(sorted[1].amount).toBe(15000)
    })
  })
})
