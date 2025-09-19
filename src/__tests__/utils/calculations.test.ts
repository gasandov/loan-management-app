import { calculateLoanDetails } from './test-utils'

describe('Loan Calculation Utilities', () => {
  describe('calculateLoanDetails', () => {
    it('should calculate monthly payment correctly for standard loan', () => {
      const result = calculateLoanDetails(50000, 5.5, 60)
      
      expect(result.monthlyPayment).toBeCloseTo(955.06, 1)
      expect(result.totalInterest).toBeCloseTo(7303.49, 1)
      expect(result.remainingBalance).toBe(50000)
    })

    it('should calculate monthly payment for zero interest rate', () => {
      const result = calculateLoanDetails(10000, 0, 12)
      
      expect(result.monthlyPayment).toBeCloseTo(833.33, 2)
      expect(result.totalInterest).toBe(0)
      expect(result.remainingBalance).toBe(10000)
    })

    it('should calculate monthly payment for short-term loan', () => {
      const result = calculateLoanDetails(1000, 10, 6)
      
      expect(result.monthlyPayment).toBeCloseTo(171.56, 1)
      expect(result.totalInterest).toBeCloseTo(29.37, 1)
      expect(result.remainingBalance).toBe(1000)
    })

    it('should handle high interest rates', () => {
      const result = calculateLoanDetails(25000, 15, 24)
      
      expect(result.monthlyPayment).toBeGreaterThan(1000)
      expect(result.totalInterest).toBeGreaterThan(4000)
      expect(result.remainingBalance).toBe(25000)
    })

    it('should handle edge case with very small amount', () => {
      const result = calculateLoanDetails(100, 5, 12)
      
      expect(result.monthlyPayment).toBeCloseTo(8.56, 1)
      expect(result.totalInterest).toBeCloseTo(2.76, 1)
      expect(result.remainingBalance).toBe(100)
    })
  })
})
