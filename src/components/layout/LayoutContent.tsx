'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { SidebarNav } from '@/components/layout/sidebar/SidebarNav'
import { Suspense } from 'react'
import { Navigation } from '@/components/layout/Navigation'

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return (
      <main className="w-full min-h-screen">
        <Suspense fallback={<div className="animate-spin text-white">Loading...</div>}>
          {children}
        </Suspense>
      </main>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <Navigation />
        <div className="flex flex-1 w-full relative">
          <SidebarNav />
          <SidebarInset>
            <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DAA520]"></div>
                </div>
              }>
                {children}
              </Suspense>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
