'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Import LoanStatus enum from Prisma client
const LoanStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  ACTIVE: 'ACTIVE',
  PAID_OFF: 'PAID_OFF',
  DEFAULTED: 'DEFAULTED',
  REJECTED: 'REJECTED',
} as const

type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus]

// Define form state type
type FormState = {
  success: boolean
  error?: string
  errors?: Record<string, string[]>
}

// Validation schemas
const createLoanSchema = z.object({
  borrowerName: z.string().min(2, 'Borrower name must be at least 2 characters'),
  borrowerEmail: z.string().email('Invalid email address'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  interestRate: z.number().min(0, 'Interest rate cannot be negative').max(100, 'Interest rate cannot exceed 100%'),
  termMonths: z.number().min(1, 'Term must be at least 1 month').max(480, 'Term cannot exceed 40 years'),
  purpose: z.string().min(5, 'Purpose must be at least 5 characters'),
  notes: z.string().optional(),
})

const updateLoanSchema = createLoanSchema.partial().extend({
  id: z.string().cuid(),
  status: z.enum(['PENDING', 'APPROVED', 'ACTIVE', 'PAID_OFF', 'DEFAULTED', 'REJECTED']).optional(),
  monthlyPayment: z.number().min(0).optional(),
  totalInterest: z.number().min(0).optional(),
  remainingBalance: z.number().min(0).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

// Helper function to calculate loan details
function calculateLoanDetails(amount: number, interestRate: number, termMonths: number) {
  const monthlyRate = interestRate / 100 / 12
  const monthlyPayment = monthlyRate === 0 
    ? amount / termMonths 
    : (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
  
  const totalInterest = (monthlyPayment * termMonths) - amount
  
  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    remainingBalance: amount,
  }
}

export async function getLoans(filters?: { status?: LoanStatus; search?: string }) {
  try {
    const where: Record<string, unknown> = {}
    
    if (filters?.status) {
      where.status = filters.status
    }
    
    if (filters?.search) {
      where.OR = [
        { borrowerName: { contains: filters.search, mode: 'insensitive' } },
        { borrowerEmail: { contains: filters.search, mode: 'insensitive' } },
        { purpose: { contains: filters.search, mode: 'insensitive' } },
      ]
    }
    
    const loans = await prisma.loan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    
    return { success: true, data: loans }
  } catch (error) {
    console.error('Error fetching loans:', error)
    return { success: false, error: 'Failed to fetch loans' }
  }
}

export async function getLoanById(id: string) {
  try {
    const loan = await prisma.loan.findUnique({
      where: { id },
    })
    
    if (!loan) {
      return { success: false, error: 'Loan not found' }
    }
    
    return { success: true, data: loan }
  } catch (error) {
    console.error('Error fetching loan:', error)
    return { success: false, error: 'Failed to fetch loan' }
  }
}

export async function createLoan(prevState: FormState | null, formData: FormData): Promise<FormState> {
  try {
    const validatedFields = createLoanSchema.safeParse({
      borrowerName: formData.get('borrowerName'),
      borrowerEmail: formData.get('borrowerEmail'),
      amount: parseFloat(formData.get('amount') as string),
      interestRate: parseFloat(formData.get('interestRate') as string),
      termMonths: parseInt(formData.get('termMonths') as string),
      purpose: formData.get('purpose'),
      notes: formData.get('notes') || undefined,
    })

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { amount, interestRate, termMonths, ...data } = validatedFields.data
    const calculatedDetails = calculateLoanDetails(amount, interestRate, termMonths)

    await prisma.loan.create({
      data: {
        ...data,
        amount,
        interestRate,
        termMonths,
        ...calculatedDetails,
      },
    })

    revalidatePath('/loans')
    redirect('/loans')
  } catch (error) {
    console.error('Error creating loan:', error)
    return { success: false, error: 'Failed to create loan' }
  }
}

export async function updateLoan(prevState: FormState | null, formData: FormData): Promise<FormState> {
  try {
    const id = formData.get('id') as string
    const validatedFields = updateLoanSchema.safeParse({
      id,
      borrowerName: formData.get('borrowerName'),
      borrowerEmail: formData.get('borrowerEmail'),
      amount: formData.get('amount') ? parseFloat(formData.get('amount') as string) : undefined,
      interestRate: formData.get('interestRate') ? parseFloat(formData.get('interestRate') as string) : undefined,
      termMonths: formData.get('termMonths') ? parseInt(formData.get('termMonths') as string) : undefined,
      purpose: formData.get('purpose'),
      notes: formData.get('notes') || undefined,
      status: formData.get('status') as LoanStatus || undefined,
    })

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { id: loanId, amount, interestRate, termMonths, ...updateData } = validatedFields.data

    // Recalculate loan details if core parameters changed
    let calculatedDetails = {}
    if (amount || interestRate || termMonths) {
      const existing = await prisma.loan.findUnique({ where: { id: loanId } })
      if (existing) {
        calculatedDetails = calculateLoanDetails(
          amount ?? existing.amount,
          interestRate ?? existing.interestRate,
          termMonths ?? existing.termMonths
        )
      }
    }

    await prisma.loan.update({
      where: { id: loanId },
      data: {
        ...updateData,
        ...(amount && { amount }),
        ...(interestRate && { interestRate }),
        ...(termMonths && { termMonths }),
        ...calculatedDetails,
      },
    })

    revalidatePath('/loans')
    revalidatePath(`/loans/${loanId}`)
    redirect('/loans')
  } catch (error) {
    console.error('Error updating loan:', error)
    return { success: false, error: 'Failed to update loan' }
  }
}

export async function deleteLoan(id: string) {
  try {
    await prisma.loan.delete({
      where: { id },
    })

    revalidatePath('/loans')
    return { success: true }
  } catch (error) {
    console.error('Error deleting loan:', error)
    return { success: false, error: 'Failed to delete loan' }
  }
}

export async function updateLoanStatus(id: string, status: LoanStatus) {
  try {
    const updateData: Record<string, unknown> = { status }
    
    // Set start date when loan is approved
    if (status === LoanStatus.APPROVED) {
      updateData.startDate = new Date()
      
      // Calculate end date based on term
      const loan = await prisma.loan.findUnique({ where: { id } })
      if (loan) {
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + loan.termMonths)
        updateData.endDate = endDate
      }
    }

    await prisma.loan.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/loans')
    revalidatePath(`/loans/${id}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating loan status:', error)
    return { success: false, error: 'Failed to update loan status' }
  }
}
