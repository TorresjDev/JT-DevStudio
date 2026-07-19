'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { SidebarNav } from '@/components/layout/sidebar/SidebarNav'
import { Suspense } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

function PageFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-in fade-in duration-500">
      {/* Branded spinner */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-goldenrod/25 animate-spin border-t-goldenrod-dark dark:border-t-goldenrod" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-goldenrod/20 animate-pulse" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  )
}

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
        <Navigation />
        {/* Offset for fixed h-14 navbar so content / sidebar sit below it */}
        <div className="relative flex min-h-0 w-full min-w-0 flex-1 pt-14">
          <SidebarNav />
          <SidebarInset className="min-h-0 overflow-x-hidden">
            <div className="min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto p-1 md:p-2 lg:p-4">
              <Suspense fallback={<PageFallback />}>
                {children}
              </Suspense>
            </div>
            {/* Footer lives inside the inset so it readjusts with the sidebar */}
            <Footer />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
