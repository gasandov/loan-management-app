import { z } from 'zod'

export const loanFormSchema = z.object({
  borrowerName: z.string().min(1, 'Borrower name is required').trim().refine(val => val.length > 0, 'Borrower name cannot be only whitespace'),
  borrowerEmail: z.string().email('Invalid email address'),
  borrowerPhone: z.string().min(1, 'Phone number is required').refine(val => /^[\d\s\-\(\)\+]+$/.test(val), 'Phone number can only contain digits, spaces, dashes, parentheses, and plus sign'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  interestRate: z.coerce.number().min(0, 'Interest rate cannot be negative').max(100, 'Interest rate cannot exceed 100%'),
  termMonths: z.coerce.number().min(1, 'Term must be at least 1 month').max(480, 'Term cannot exceed 40 years'),
  purpose: z.string().min(1, 'Purpose is required').trim().refine(val => val.length > 0, 'Purpose cannot be only whitespace'),
})

export type LoanFormData = z.infer<typeof loanFormSchema>
