import { LoanStatus } from '@/types/loan'
import { CheckIcon, PauseIcon, PlayIcon, XIcon } from 'lucide-react'

export const getAvailableStatusTransitions = (currentStatus: string) => {
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