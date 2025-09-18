'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoanStatus } from '@/types/loan'
import { SearchIcon, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function LoanFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')

  const updateFilters = () => {
    const params = new URLSearchParams()
    
    if (search.trim()) {
      params.set('search', search.trim())
    }
    
    if (status && status !== 'all') {
      params.set('status', status)
    }
    
    const queryString = params.toString()
    router.push(`/loans${queryString ? `?${queryString}` : ''}`)
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('all')
    router.push('/loans')
  }

  const hasFilters = search.trim() || (status && status !== 'all')

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search by borrower name, email, or purpose..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateFilters()
            }
          }}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-48">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={LoanStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={LoanStatus.APPROVED}>Approved</SelectItem>
            <SelectItem value={LoanStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={LoanStatus.PAID_OFF}>Paid Off</SelectItem>
            <SelectItem value={LoanStatus.DEFAULTED}>Defaulted</SelectItem>
            <SelectItem value={LoanStatus.REJECTED}>Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={updateFilters}>
          Apply Filters
        </Button>
        {hasFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <XIcon className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
