import { LoanStatusActions } from '@/components/loans/loan-status-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getLoanById } from '@/lib/actions'
import { LoanStatus } from '@/types/loan'
import { format, formatDistanceToNow } from 'date-fns'
import { ArrowLeftIcon, CalendarIcon, DollarSignIcon, PencilIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface LoanDetailPageProps {
  params: {
    id: string
  }
}

function getStatusVariant(status: string) {
  switch (status) {
    case LoanStatus.APPROVED:
      return 'default'
    case LoanStatus.ACTIVE:
      return 'default'
    case LoanStatus.PENDING:
      return 'secondary'
    case LoanStatus.REJECTED:
      return 'destructive'
    case LoanStatus.DEFAULTED:
      return 'destructive'
    case LoanStatus.PAID_OFF:
      return 'outline'
    default:
      return 'secondary'
  }
}

export default async function LoanDetailPage({ params }: LoanDetailPageProps) {
  const { id } = await params
  const result = await getLoanById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const loan = result.data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/loans">
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Loans
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loan Details</h1>
            <p className="text-gray-600 mt-1">
              Created {formatDistanceToNow(new Date(loan.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={getStatusVariant(loan.status)} className="text-sm">
            {loan.status.replace('_', ' ')}
          </Badge>
          <Link href={`/loans/${loan.id}/edit`}>
            <Button>
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Loan
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Borrower Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5" />
                <span>Borrower Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg font-semibold">{loan.borrowerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{loan.borrowerEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSignIcon className="w-5 h-5" />
                <span>Loan Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Principal Amount</label>
                  <p className="text-2xl font-bold">${loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Interest Rate</label>
                  <p className="text-2xl font-bold flex items-center">{loan.interestRate}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Term</label>
                  <p className="text-2xl font-bold">
                    {loan.termMonths} month{loan.termMonths === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <Separator />

              {loan.monthlyPayment && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Monthly Payment</label>
                    <p className="text-xl font-semibold">${loan.monthlyPayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Interest</label>
                    <p className="text-xl font-semibold">
                      ${loan.totalInterest?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Remaining Balance</label>
                    <p className="text-xl font-semibold">
                      ${loan.remainingBalance?.toLocaleString() || loan.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Purpose and Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Purpose & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Loan Purpose</label>
                <p className="text-base mt-1">{loan.purpose}</p>
              </div>
              {loan.notes && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Additional Notes</label>
                    <p className="text-base mt-1 whitespace-pre-wrap">{loan.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Status Actions</CardTitle>
              <CardDescription>Update the loan status based on its current stage</CardDescription>
            </CardHeader>
            <CardContent>
              <LoanStatusActions loan={loan} />
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>Important Dates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Application Date</label>
                <p className="text-base">{format(new Date(loan.createdAt), 'PPP')}</p>
              </div>
              {loan.startDate && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Date</label>
                  <p className="text-base">{format(new Date(loan.startDate), 'PPP')}</p>
                </div>
              )}
              {loan.endDate && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Maturity Date</label>
                  <p className="text-base">{format(new Date(loan.endDate), 'PPP')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
