'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FileTextIcon, HomeIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
  },
  {
    name: 'Loans',
    href: '/loans',
    icon: FileTextIcon,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">
              Loan Management
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <div className="flex space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Add Loan Button */}
            <Link href="/loans/new">
              <Button className="flex items-center space-x-2">
                <PlusIcon className="w-4 h-4" />
                <span>New Loan</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
