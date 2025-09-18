'use client'

import { Button } from '@/components/ui/button'
import { updateLoanStatus } from '@/lib/actions'
import { Loan, LoanStatus } from '@/types/loan'
import { CheckIcon, PauseIcon, PlayIcon, XIcon } from 'lucide-react'
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

  const getAvailableStatusTransitions = (currentStatus: string) => {
    switch (currentStatus) {
      case LoanStatus.PENDING:
        return [
          { status: LoanStatus.APPROVED, label: 'Approve', icon: CheckIcon, variant: 'default' as const },
          { status: LoanStatus.REJECTED, label: 'Reject', icon: XIcon, variant: 'destructive' as const },
        ]
      case LoanStatus.APPROVED:
        return [
          { status: LoanStatus.ACTIVE, label: 'Activate', icon: PlayIcon, variant: 'default' as const },
          { status: LoanStatus.REJECTED, label: 'Reject', icon: XIcon, variant: 'destructive' as const },
        ]
      case LoanStatus.ACTIVE:
        return [
          { status: LoanStatus.PAID_OFF, label: 'Mark Paid Off', icon: CheckIcon, variant: 'default' as const },
          { status: LoanStatus.DEFAULTED, label: 'Mark Defaulted', icon: PauseIcon, variant: 'destructive' as const },
        ]
      default:
        return []
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
