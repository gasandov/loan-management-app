import { LoanForm } from '@/components/loans/loan-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getLoanById } from '@/lib/actions'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface EditLoanPageProps {
  params: {
    id: string
  }
}

export default async function EditLoanPage({ params }: EditLoanPageProps) {
  const result = await getLoanById(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  const loan = result.data

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/loans/${loan.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Loan Details
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Loan</h1>
          <p className="text-gray-600 mt-1">
            Update loan information for {loan.borrowerName}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
          <CardDescription>
            Make changes to the loan information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoanForm loan={loan} isEditing={true} />
        </CardContent>
      </Card>
    </div>
  )
}
