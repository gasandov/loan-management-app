import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getLoans } from '@/lib/actions'
import { LoanStatus } from '@/types/loan'
import { formatDistanceToNow } from 'date-fns'
import { EyeIcon, PencilIcon } from 'lucide-react'
import Link from 'next/link'

interface LoansTableProps {
  filters: {
    search?: string
    status?: string
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

export async function LoansTable({ filters }: LoansTableProps) {
  const result = await getLoans({
    search: filters.search,
    status: filters.status as keyof typeof LoanStatus,
  })

  if (!result.success) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading loans: {result.error}</p>
      </div>
    )
  }

  const loans = result.data || []

  if (loans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          {filters.search || filters.status 
            ? 'No loans match your search criteria.' 
            : 'No loans found.'
          }
        </p>
        <Link href="/loans/new">
          <Button>Create First Loan</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Showing {loans.length} loan{loans.length === 1 ? '' : 's'}
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Borrower</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Interest Rate</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id} className="hover:bg-gray-50">
              <TableCell>
                <div>
                  <div className="font-medium">{loan.borrowerName}</div>
                  <div className="text-sm text-gray-600">{loan.borrowerEmail}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  ${loan.amount.toLocaleString()}
                </div>
                {loan.monthlyPayment && (
                  <div className="text-sm text-gray-600">
                    ${loan.monthlyPayment.toLocaleString()}/mo
                  </div>
                )}
              </TableCell>
              <TableCell>{loan.interestRate}%</TableCell>
              <TableCell>
                {loan.termMonths} month{loan.termMonths === 1 ? '' : 's'}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(loan.status)}>
                  {loan.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {formatDistanceToNow(new Date(loan.createdAt), { addSuffix: true })}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Link href={`/loans/${loan.id}`}>
                    <Button variant="ghost" size="sm">
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/loans/${loan.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
