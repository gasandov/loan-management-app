'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { createLoan, updateLoan } from '@/lib/actions'
import { Loan, LoanStatus } from '@/types/loan'
import { AlertCircleIcon, CalculatorIcon } from 'lucide-react'
import { useState } from 'react'
import { useFormState } from 'react-dom'

interface LoanFormProps {
  loan?: Loan
  isEditing?: boolean
}

type FormState = {
  success: boolean
  error?: string
  errors?: Record<string, string[]>
}

const initialState: FormState = { success: false }

export function LoanForm({ loan, isEditing = false }: LoanFormProps) {
  const [formState, formAction] = useFormState(
    isEditing ? updateLoan : createLoan,
    initialState
  )
  
  const [amount, setAmount] = useState(loan?.amount?.toString() || '')
  const [interestRate, setInterestRate] = useState(loan?.interestRate?.toString() || '')
  const [termMonths, setTermMonths] = useState(loan?.termMonths?.toString() || '')
  const [calculatedPayment, setCalculatedPayment] = useState<number | null>(null)

  // Calculate monthly payment preview
  const calculatePayment = () => {
    const principal = parseFloat(amount)
    const rate = parseFloat(interestRate) / 100 / 12
    const months = parseInt(termMonths)

    if (principal > 0 && rate >= 0 && months > 0) {
      let payment
      if (rate === 0) {
        payment = principal / months
      } else {
        payment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      }
      setCalculatedPayment(Math.round(payment * 100) / 100)
    } else {
      setCalculatedPayment(null)
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={loan?.id} />}
      
      {/* Error Display */}
      {formState?.error && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>{formState.error}</AlertDescription>
        </Alert>
      )}

      {/* Borrower Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Borrower Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="borrowerName">Borrower Name *</Label>
            <Input
              id="borrowerName"
              name="borrowerName"
              placeholder="Enter full name"
              defaultValue={loan?.borrowerName || ''}
              required
            />
            {formState?.errors?.borrowerName && (
              <p className="text-sm text-red-600">{formState.errors.borrowerName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrowerEmail">Email Address *</Label>
            <Input
              id="borrowerEmail"
              name="borrowerEmail"
              type="email"
              placeholder="Enter email address"
              defaultValue={loan?.borrowerEmail || ''}
              required
            />
            {formState?.errors?.borrowerEmail && (
              <p className="text-sm text-red-600">{formState.errors.borrowerEmail[0]}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Loan Terms */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Loan Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Loan Amount ($) *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="1"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={calculatePayment}
              required
            />
            {formState?.errors?.amount && (
              <p className="text-sm text-red-600">{formState.errors.amount[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%) *</Label>
            <Input
              id="interestRate"
              name="interestRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="0.00"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              onBlur={calculatePayment}
              required
            />
            {formState?.errors?.interestRate && (
              <p className="text-sm text-red-600">{formState.errors.interestRate[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="termMonths">Term (Months) *</Label>
            <Input
              id="termMonths"
              name="termMonths"
              type="number"
              min="1"
              max="480"
              placeholder="12"
              value={termMonths}
              onChange={(e) => setTermMonths(e.target.value)}
              onBlur={calculatePayment}
              required
            />
            {formState?.errors?.termMonths && (
              <p className="text-sm text-red-600">{formState.errors.termMonths[0]}</p>
            )}
          </div>
        </div>

        {/* Payment Calculator */}
        {calculatedPayment && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CalculatorIcon className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Calculated Payment</h4>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              ${calculatedPayment.toLocaleString()}/month
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Total interest: ${((calculatedPayment * parseInt(termMonths || '0')) - parseFloat(amount || '0')).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <Separator />

      {/* Loan Purpose and Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="purpose">Loan Purpose *</Label>
          <Textarea
            id="purpose"
            name="purpose"
            placeholder="Describe the purpose of this loan..."
            rows={3}
            defaultValue={loan?.purpose || ''}
            required
          />
          {formState?.errors?.purpose && (
            <p className="text-sm text-red-600">{formState.errors.purpose[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any additional notes or comments..."
            rows={3}
            defaultValue={loan?.notes || ''}
          />
          {formState?.errors?.notes && (
            <p className="text-sm text-red-600">{formState.errors.notes[0]}</p>
          )}
        </div>

        {/* Status Update for Editing */}
        {isEditing && loan && (
          <div className="space-y-2">
            <Label htmlFor="status">Loan Status</Label>
            <Select name="status" defaultValue={loan.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={LoanStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={LoanStatus.APPROVED}>Approved</SelectItem>
                <SelectItem value={LoanStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={LoanStatus.PAID_OFF}>Paid Off</SelectItem>
                <SelectItem value={LoanStatus.DEFAULTED}>Defaulted</SelectItem>
                <SelectItem value={LoanStatus.REJECTED}>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Loan' : 'Create Loan'}
        </Button>
      </div>
    </form>
  )
}
