/**
 * @jest-environment jsdom
 */
import { loanFormSchema } from '@/lib/validations'
import { ZodError } from 'zod'

describe('Loan Form Validation', () => {
  const validLoanData = {
    borrowerName: 'John Doe',
    borrowerEmail: 'john@example.com',
    borrowerPhone: '+1-555-0123',
    amount: 25000,
    termMonths: 24,
    interestRate: 5.5,
    purpose: 'Home improvement'
  }

  describe('Valid data', () => {
    it('should accept valid loan data', () => {
      const result = loanFormSchema.safeParse(validLoanData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validLoanData)
      }
    })
  })

  describe('Borrower name validation', () => {
    it('should reject empty borrower name', () => {
      const invalidData = { ...validLoanData, borrowerName: '' }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject borrower name with only whitespace', () => {
      const invalidData = { ...validLoanData, borrowerName: '   ' }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept valid borrower name with spaces', () => {
      const validData = { ...validLoanData, borrowerName: 'John Michael Doe' }
      const result = loanFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Email validation', () => {
    it('should reject invalid email format', () => {
      const invalidData = { ...validLoanData, borrowerEmail: 'invalid-email' }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject email without domain', () => {
      const invalidData = { ...validLoanData, borrowerEmail: 'john@' }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept valid email formats', () => {
      const validEmails = [
        'john@example.com',
        'john.doe@company.org',
        'user+tag@domain.co.uk'
      ]

      validEmails.forEach(email => {
        const validData = { ...validLoanData, borrowerEmail: email }
        const result = loanFormSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Phone validation', () => {
    it('should accept various phone formats', () => {
      const validPhones = [
        '+1-555-0123',
        '(555) 123-4567',
        '555-123-4567',
        '5551234567'
      ]

      validPhones.forEach(phone => {
        const validData = { ...validLoanData, borrowerPhone: phone }
        const result = loanFormSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })

    it('should reject phone with letters', () => {
      const invalidData = { ...validLoanData, borrowerPhone: '555-abc-1234' }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Amount validation', () => {
    it('should reject negative amounts', () => {
      const invalidData = { ...validLoanData, amount: -1000 }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject zero amount', () => {
      const invalidData = { ...validLoanData, amount: 0 }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept minimum valid amount', () => {
      const validData = { ...validLoanData, amount: 1 }
      const result = loanFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept large amounts', () => {
      const validData = { ...validLoanData, amount: 1000000 }
      const result = loanFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Term months validation', () => {
    it('should reject negative terms', () => {
      const invalidData = { ...validLoanData, termMonths: -12 }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject zero terms', () => {
      const invalidData = { ...validLoanData, termMonths: 0 }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept valid term ranges', () => {
      const validTerms = [1, 12, 24, 36, 60, 120]
      
      validTerms.forEach(term => {
        const validData = { ...validLoanData, termMonths: term }
        const result = loanFormSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Interest rate validation', () => {
    it('should reject negative interest rates', () => {
      const invalidData = { ...validLoanData, interestRate: -1.5 }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept zero interest rate', () => {
      const validData = { ...validLoanData, interestRate: 0 }
      const result = loanFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept decimal interest rates', () => {
      const validRates = [0.5, 3.25, 5.75, 12.5, 18.99]
      
      validRates.forEach(rate => {
        const validData = { ...validLoanData, interestRate: rate }
        const result = loanFormSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })

    it('should reject extremely high interest rates', () => {
      const invalidData = { ...validLoanData, interestRate: 101 }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Purpose validation', () => {
    it('should reject empty purpose', () => {
      const invalidData = { ...validLoanData, purpose: '' }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject purpose with only whitespace', () => {
      const invalidData = { ...validLoanData, purpose: '   ' }
      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept valid purposes', () => {
      const validPurposes = [
        'Home improvement',
        'Debt consolidation',
        'Car purchase',
        'Business expansion',
        'Education'
      ]

      validPurposes.forEach(purpose => {
        const validData = { ...validLoanData, purpose }
        const result = loanFormSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Multiple validation errors', () => {
    it('should return multiple errors for invalid data', () => {
      const invalidData = {
        borrowerName: '',
        borrowerEmail: 'invalid-email',
        borrowerPhone: 'abc-123-def',
        amount: -1000,
        termMonths: 0,
        interestRate: -5,
        purpose: ''
      }

      const result = loanFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      
      if (!result.success) {
        const errors = result.error as ZodError
        expect(errors.issues.length).toBeGreaterThan(1)
        
        // Check that we have errors for the expected fields
        const fieldNames = errors.issues.map(issue => issue.path[0])
        expect(fieldNames).toContain('borrowerName')
        expect(fieldNames).toContain('borrowerEmail')
        expect(fieldNames).toContain('amount')
        expect(fieldNames).toContain('termMonths')
        expect(fieldNames).toContain('interestRate')
        expect(fieldNames).toContain('purpose')
      }
    })
  })

  describe('Type coercion', () => {
    it('should handle string numbers for amount', () => {
      const dataWithStringAmount = { ...validLoanData, amount: '25000' as unknown as number }
      const result = loanFormSchema.safeParse(dataWithStringAmount)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(typeof result.data.amount).toBe('number')
        expect(result.data.amount).toBe(25000)
      }
    })

    it('should handle string numbers for term months', () => {
      const dataWithStringTerm = { ...validLoanData, termMonths: '24' as unknown as number }
      const result = loanFormSchema.safeParse(dataWithStringTerm)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(typeof result.data.termMonths).toBe('number')
        expect(result.data.termMonths).toBe(24)
      }
    })

    it('should handle string numbers for interest rate', () => {
      const dataWithStringRate = { ...validLoanData, interestRate: '5.5' as unknown as number }
      const result = loanFormSchema.safeParse(dataWithStringRate)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(typeof result.data.interestRate).toBe('number')
        expect(result.data.interestRate).toBe(5.5)
      }
    })
  })
})
