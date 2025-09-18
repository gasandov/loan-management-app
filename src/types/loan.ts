import { Loan } from '@prisma/client'

export type { Loan }

// LoanStatus enum for type safety
export const LoanStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  ACTIVE: 'ACTIVE',
  PAID_OFF: 'PAID_OFF',
  DEFAULTED: 'DEFAULTED',
  REJECTED: 'REJECTED',
} as const

export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus]

export type CreateLoanData = {
  borrowerName: string
  borrowerEmail: string
  amount: number
  interestRate: number
  termMonths: number
  purpose: string
  notes?: string
}

export type UpdateLoanData = Partial<CreateLoanData> & {
  id: string
  status?: LoanStatus
  monthlyPayment?: number
  totalInterest?: number
  remainingBalance?: number
  startDate?: Date
  endDate?: Date
}

export type LoanFormData = {
  borrowerName: string
  borrowerEmail: string
  amount: string
  interestRate: string
  termMonths: string
  purpose: string
  notes?: string
}

export type LoanFilters = {
  status?: LoanStatus
  search?: string
}
