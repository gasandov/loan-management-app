import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getLoans } from '@/lib/actions'
import { LoanStatus } from '@/types/loan'
import { AlertCircleIcon, DollarSignIcon, PlusIcon, TrendingUpIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'

async function getDashboardStats() {
  const result = await getLoans()

  if (!result.success || !result.data) {
    return {
      totalLoans: 0,
      activeLoans: 0,
      pendingLoans: 0,
      totalAmount: 0,
    }
  }

  const loans = result.data
  const totalLoans = loans.length
  const activeLoans = loans.filter((loan) => loan.status === LoanStatus.ACTIVE).length
  const pendingLoans = loans.filter((loan) => loan.status === LoanStatus.PENDING).length
  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0)

  return {
    totalLoans,
    activeLoans,
    pendingLoans,
    totalAmount,
  }
}

export default async function Home() {
  const stats = await getDashboardStats()
  const recentLoansResult = await getLoans()
  const recentLoans = recentLoansResult.success ? recentLoansResult.data?.slice(0, 5) || [] : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your loan management system</p>
        </div>
        <Link href="/loans/new">
          <Button size="lg" className="flex items-center space-x-2">
            <PlusIcon className="w-5 h-5" />
            <span>Create New Loan</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <UsersIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLoans}</div>
            <p className="text-xs text-muted-foreground">All loans in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <TrendingUpIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLoans}</div>
            <p className="text-xs text-muted-foreground">Currently active loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertCircleIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLoans}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSignIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total loan amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Loans */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Loans</CardTitle>
            <CardDescription>Latest loan applications in the system</CardDescription>
          </div>
          <Link href="/loans">
            <Button variant="outline">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLoans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No loans created yet.</p>
              <Link href="/loans/new">
                <Button className="mt-4">Create Your First Loan</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{loan.borrowerName}</p>
                        <p className="text-sm text-gray-600">{loan.borrowerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-medium">${loan.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Purpose</p>
                        <p className="font-medium truncate max-w-32">{loan.purpose}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        loan.status === LoanStatus.APPROVED
                          ? 'default'
                          : loan.status === LoanStatus.PENDING
                            ? 'secondary'
                            : loan.status === LoanStatus.ACTIVE
                              ? 'default'
                              : loan.status === LoanStatus.REJECTED
                                ? 'destructive'
                                : 'secondary'
                      }
                    >
                      {loan.status}
                    </Badge>
                    <Link href={`/loans/${loan.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
