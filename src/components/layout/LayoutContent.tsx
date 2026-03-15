'use client'

import { usePathname } from 'next/navigation'
<<<<<<< Updated upstream
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
=======
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
>>>>>>> Stashed changes
import { SidebarNav } from '@/components/layout/sidebar/SidebarNav'
import { Suspense } from 'react'

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
<<<<<<< Updated upstream
      <div className="flex min-h-screen w-full">
        <SidebarNav />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DAA520]"></div>
              </div>
            }>
              {children}
            </Suspense>
          </main>
        </div>
=======
<<<<<<< Updated upstream
      <div className="flex max-h-full max-w-full w-full">
        <aside>
          <SidebarNav />
        </aside>
        <main className="w-full flex flex-1 mx-2 mt-24 sm:mt-20 md:mt-16 p-3 md:p-1 transition-all duration-300 ease-in-out md:ml-60 group-data-[state=collapsed]/sidebar-wrapper:md:ml-12"> 
        {/* md:ml-[15rem] group-data-[state=collapsed]/sidebar-wrapper:md:ml-[3rem] */}
          <SidebarTrigger />
          <section className="w-full flex flex-col mx-auto min-h-[95vh] overflow-y-auto px-2">
            <Suspense fallback={<div className="animate-spin text-white">Loading...</div>}>
              {children}
            </Suspense>
          </section>
        </main>
=======
      <div className="flex flex-col min-h-screen w-full">
        {/* Global Top Navbar spanning full width */}
        <Navigation />
        
        {/* Main Application Shell */}
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
>>>>>>> Stashed changes
>>>>>>> Stashed changes
      </div>
    </SidebarProvider>
  )
}
