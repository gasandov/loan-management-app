import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircleIcon, ArrowLeftIcon, HomeIcon } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircleIcon className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle>Loan Not Found</CardTitle>
          <CardDescription>
            The loan you&apos;re looking for doesn&apos;t exist or may have been removed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/loans" className="flex-1">
              <Button variant="outline" className="w-full">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Loans
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">
                <HomeIcon className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
