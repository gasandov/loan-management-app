import { LoanForm } from '@/components/loans/loan-form'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockLoan } from '../utils/test-utils'

// Mock the server actions
jest.mock('@/lib/actions', () => ({
  createLoan: jest.fn(),
  updateLoan: jest.fn(),
}))

// Mock useFormState
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn(() => [{ success: false }, jest.fn()]),
}))

describe('LoanForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Creating a new loan', () => {
    it('should render all form fields', () => {
      render(<LoanForm />)

      expect(screen.getByLabelText(/borrower name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/loan amount/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/interest rate/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/term \(months\)/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/loan purpose/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/additional notes/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create loan/i })).toBeInTheDocument()
    })

    // it('should calculate monthly payment when loan details are entered', async () => {
    //   render(<LoanForm />)

    //   const amountInput = screen.getByLabelText(/loan amount/i)
    //   const interestInput = screen.getByLabelText(/interest rate/i)
    //   const termInput = screen.getByLabelText(/term \(months\)/i)

    //   await user.type(amountInput, '50000')
    //   await user.type(interestInput, '5.5')
    //   await user.type(termInput, '60')

    //   // Trigger calculation by blurring one of the fields
    //   fireEvent.blur(termInput)

    //   await waitFor(() => {
    //     expect(screen.getByText(/calculated payment/i)).toBeInTheDocument()
    //     expect(screen.getByText(/\$956\.79\/month/)).toBeInTheDocument()
    //   })
    // })

    // it('should show validation errors for empty required fields', async () => {
    //   const { useFormState } = require('react-dom')
    //   useFormState.mockReturnValue([
    //     {
    //       success: false,
    //       errors: {
    //         borrowerName: ['Borrower name must be at least 2 characters'],
    //         borrowerEmail: ['Invalid email address'],
    //         amount: ['Amount must be greater than 0'],
    //       }
    //     },
    //     jest.fn()
    //   ])

    //   render(<LoanForm />)

    //   expect(screen.getByText('Borrower name must be at least 2 characters')).toBeInTheDocument()
    //   expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    //   expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument()
    // })

    // it('should display general error messages', () => {
    //   const { useFormState } = require('react-dom')
    //   useFormState.mockReturnValue([
    //     {
    //       success: false,
    //       error: 'Failed to create loan',
    //     },
    //     jest.fn(),
    //   ])

    //   render(<LoanForm />)

    //   expect(screen.getByText('Failed to create loan')).toBeInTheDocument()
    // })
  })

  describe('Editing an existing loan', () => {
    it('should populate form fields with existing loan data', () => {
      render(<LoanForm loan={mockLoan} isEditing={true} />)

      expect(screen.getByDisplayValue(mockLoan.borrowerName)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockLoan.borrowerEmail)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockLoan.amount.toString())).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockLoan.interestRate.toString())).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockLoan.termMonths.toString())).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockLoan.purpose)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockLoan.notes || '')).toBeInTheDocument()
    })

    it('should show update button for editing mode', () => {
      render(<LoanForm loan={mockLoan} isEditing={true} />)

      expect(screen.getByRole('button', { name: /update loan/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /create loan/i })).not.toBeInTheDocument()
    })

    // it('should show status dropdown in editing mode', () => {
    //   render(<LoanForm loan={mockLoan} isEditing={true} />)

    //   expect(screen.getByLabelText(/loan status/i)).toBeInTheDocument()
    // })

    it('should include hidden loan ID field in editing mode', () => {
      render(<LoanForm loan={mockLoan} isEditing={true} />)

      const hiddenIdField = document.querySelector('input[name="id"]') as HTMLInputElement
      expect(hiddenIdField).toBeInTheDocument()
      expect(hiddenIdField.value).toBe(mockLoan.id)
    })
  })

  describe('Form interactions', () => {
    it('should allow typing in all input fields', async () => {
      render(<LoanForm />)

      const nameInput = screen.getByLabelText(/borrower name/i)
      const emailInput = screen.getByLabelText(/email address/i)
      const amountInput = screen.getByLabelText(/loan amount/i)

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(amountInput, '25000')

      expect(nameInput).toHaveValue('John Doe')
      expect(emailInput).toHaveValue('john@example.com')
      expect(amountInput).toHaveValue(25000)
    })

    it('should clear calculation when amount is cleared', async () => {
      render(<LoanForm />)

      const amountInput = screen.getByLabelText(/loan amount/i)
      const interestInput = screen.getByLabelText(/interest rate/i)
      const termInput = screen.getByLabelText(/term \(months\)/i)

      // Enter values to trigger calculation
      await user.type(amountInput, '50000')
      await user.type(interestInput, '5.5')
      await user.type(termInput, '60')
      fireEvent.blur(termInput)

      await waitFor(() => {
        expect(screen.getByText(/calculated payment/i)).toBeInTheDocument()
      })

      // Clear amount
      await user.clear(amountInput)
      fireEvent.blur(amountInput)

      await waitFor(() => {
        expect(screen.queryByText(/calculated payment/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for all form inputs', () => {
      render(<LoanForm />)

      const inputs = [
        'borrowerName',
        'borrowerEmail',
        'amount',
        'interestRate',
        'termMonths',
        'purpose',
        'notes',
      ]

      inputs.forEach((inputName) => {
        const input = document.querySelector(`[name="${inputName}"]`)
        expect(input).toHaveAccessibleName()
      })
    })

    it('should have required attributes on required fields', () => {
      render(<LoanForm />)

      const requiredFields = [
        'borrowerName',
        'borrowerEmail',
        'amount',
        'interestRate',
        'termMonths',
        'purpose',
      ]

      requiredFields.forEach((fieldName) => {
        const field = document.querySelector(`[name="${fieldName}"]`)
        expect(field).toBeRequired()
      })
    })

    it('should have proper input types', () => {
      render(<LoanForm />)

      expect(screen.getByLabelText(/email address/i)).toHaveAttribute('type', 'email')
      expect(screen.getByLabelText(/loan amount/i)).toHaveAttribute('type', 'number')
      expect(screen.getByLabelText(/interest rate/i)).toHaveAttribute('type', 'number')
      expect(screen.getByLabelText(/term \(months\)/i)).toHaveAttribute('type', 'number')
    })
  })
})
