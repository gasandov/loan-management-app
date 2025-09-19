'use client'

import { Button } from '@/components/ui/button'
import { updateLoanStatus } from '@/lib/actions'
import { Loan, LoanStatus } from '@/types/loan'
import { getAvailableStatusTransitions } from '@/utils/loans/getAvailableStatusTransitions'

import { useState } from 'react'
import { toast } from 'sonner'

interface LoanStatusActionsProps {
  loan: Loan
}

export function LoanStatusActions({ loan }: LoanStatusActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const result = await updateLoanStatus(loan.id, newStatus as LoanStatus)
      if (result.success) {
        toast.success('Loan status updated successfully')
      } else {
        toast.error(result.error || 'Failed to update loan status')
      }
    } catch {
      toast.error('An error occurred while updating the loan status')
    } finally {
      setIsUpdating(false)
    }
  }

  const availableTransitions = getAvailableStatusTransitions(loan.status)

  if (availableTransitions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">No status changes available for current state</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-3">
        Current Status: <span className="font-medium">{loan.status.replace('_', ' ')}</span>
      </div>

      {availableTransitions.map((transition) => {
        const Icon = transition.icon
        return (
          <Button
            key={transition.status}
            variant={transition.variant}
            className="w-full justify-start"
            onClick={() => handleStatusUpdate(transition.status)}
            disabled={isUpdating}
          >
            <Icon className="w-4 h-4 mr-2" />
            {isUpdating ? 'Updating...' : transition.label}
          </Button>
        )
      })}
    </div>
  )
}
