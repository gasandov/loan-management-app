import { LoanFilters } from '@/components/loans/loan-filters'
import { LoansTable } from '@/components/loans/loans-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoanStatus } from '@/types/loan'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

interface LoansPageProps {
  searchParams: {
    search?: string
    status?: string
  }
}

export default async function LoansPage({ searchParams }: LoansPageProps) {
  const filters = {
    search: searchParams.search,
    status: searchParams.status as keyof typeof LoanStatus,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all loan applications
          </p>
        </div>
        <Link href="/loans/new">
          <Button className="flex items-center space-x-2">
            <PlusIcon className="w-4 h-4" />
            <span>New Loan</span>
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <LoanFilters />
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading loans...</div>}>
            <LoansTable filters={filters} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
