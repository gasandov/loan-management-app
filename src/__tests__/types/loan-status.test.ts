import { LoanStatus } from '@/types/loan'

describe('Loan Status', () => {
  describe('LoanStatus enum', () => {
    it('should have all expected status values', () => {
      expect(LoanStatus.PENDING).toBe('PENDING')
      expect(LoanStatus.APPROVED).toBe('APPROVED')
      expect(LoanStatus.ACTIVE).toBe('ACTIVE')
      expect(LoanStatus.PAID_OFF).toBe('PAID_OFF')
      expect(LoanStatus.DEFAULTED).toBe('DEFAULTED')
      expect(LoanStatus.REJECTED).toBe('REJECTED')
    })

    it('should have 6 total status values', () => {
      const statusValues = Object.values(LoanStatus)
      expect(statusValues).toHaveLength(6)
    })

    it('should contain expected status workflow values', () => {
      const statusValues = Object.values(LoanStatus)
      expect(statusValues).toContain('PENDING')
      expect(statusValues).toContain('APPROVED')
      expect(statusValues).toContain('ACTIVE')
      expect(statusValues).toContain('PAID_OFF')
    })
  })
})
