'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { SidebarNav } from '@/components/layout/sidebar/SidebarNav'
import { Suspense } from 'react'
import { Navigation } from '@/components/layout/Navigation'

function PageFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-in fade-in duration-500">
      {/* Branded spinner */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-[#DAA520]/20 animate-spin border-t-[#DAA520]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-[#DAA520]/20 animate-pulse" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  )
}

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return (
      <main className="w-full min-h-screen">
        <Suspense fallback={<PageFallback />}>
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
              <Suspense fallback={<PageFallback />}>
                {children}
              </Suspense>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
