"use client"

import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import CartDrawer, { CartProvider } from '@/components/CartDrawer'

export default function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <SessionProvider>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </QueryClientProvider>
    </SessionProvider>
  )
}
