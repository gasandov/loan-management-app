import { Loan, LoanStatus } from '@/types/loan'

export const mockLoan: Loan = {
  id: 'test-loan-1',
  borrowerName: 'John Doe',
  borrowerEmail: 'john.doe@example.com',
  amount: 50000,
  interestRate: 5.5,
  termMonths: 60,
  purpose: 'Home improvement loan for kitchen renovation',
  status: LoanStatus.PENDING,
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
  monthlyPayment: 956.79,
  totalInterest: 7407.40,
  remainingBalance: 50000,
  startDate: null,
  endDate: null,
  notes: 'Customer has excellent credit score',
}

export const mockActiveLoan: Loan = {
  ...mockLoan,
  id: 'test-loan-2',
  status: LoanStatus.ACTIVE,
  startDate: new Date('2024-02-01T10:00:00Z'),
  endDate: new Date('2029-02-01T10:00:00Z'),
  remainingBalance: 35000,
}

export const mockLoans: Loan[] = [
  mockLoan,
  mockActiveLoan,
  {
    ...mockLoan,
    id: 'test-loan-3',
    borrowerName: 'Jane Smith',
    borrowerEmail: 'jane.smith@example.com',
    amount: 25000,
    interestRate: 4.8,
    termMonths: 36,
    purpose: 'Car loan for new vehicle purchase',
    status: LoanStatus.APPROVED,
    monthlyPayment: 742.50,
    totalInterest: 1730,
    remainingBalance: 25000,
  },
  {
    ...mockLoan,
    id: 'test-loan-4',
    borrowerName: 'Bob Johnson',
    borrowerEmail: 'bob.johnson@example.com',
    amount: 100000,
    interestRate: 6.2,
    termMonths: 120,
    purpose: 'Business expansion loan',
    status: LoanStatus.PAID_OFF,
    monthlyPayment: 1108.33,
    totalInterest: 33000,
    remainingBalance: 0,
  },
]

export const mockFormData = new FormData()
mockFormData.append('borrowerName', mockLoan.borrowerName)
mockFormData.append('borrowerEmail', mockLoan.borrowerEmail)
mockFormData.append('amount', mockLoan.amount.toString())
mockFormData.append('interestRate', mockLoan.interestRate.toString())
mockFormData.append('termMonths', mockLoan.termMonths.toString())
mockFormData.append('purpose', mockLoan.purpose)
mockFormData.append('notes', mockLoan.notes || '')

export function calculateLoanDetails(
  principal: number,
  annualRate: number,
  termMonths: number
): {
  monthlyPayment: number
  totalInterest: number
  remainingBalance: number
} {
  if (annualRate === 0) {
    const monthlyPayment = principal / termMonths
    return {
      monthlyPayment,
      totalInterest: 0,
      remainingBalance: principal,
    }
  }

  const monthlyRate = annualRate / 100 / 12
  const monthlyPayment = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)

  const totalPaid = monthlyPayment * termMonths
  const totalInterest = totalPaid - principal

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    remainingBalance: principal,
  }
}

// Helper to create mock server action responses
export const createMockResponse = <T>(data: T, success: boolean = true, error?: string) => ({
  success,
  data: success ? data : undefined,
  error: success ? undefined : error,
})

// Helper to simulate form state
export const createFormState = (errors?: Record<string, string[]>, error?: string) => ({
  success: false,
  errors,
  error,
})

// Simple test to ensure this file is valid
describe('Test Utils', () => {
  it('should export mock loan data', () => {
    expect(mockLoan.id).toBe('test-loan-1')
    expect(mockLoan.borrowerName).toBe('John Doe')
    expect(mockLoans).toHaveLength(4)
  })

  it('should export calculateLoanDetails function', () => {
    expect(typeof calculateLoanDetails).toBe('function')
    const result = calculateLoanDetails(1000, 5, 12)
    expect(result.monthlyPayment).toBeGreaterThan(0)
    expect(result.totalInterest).toBeGreaterThan(0)
    expect(result.remainingBalance).toBe(1000)
  })
})
