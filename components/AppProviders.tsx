"use client"

import type { ReactNode } from 'react'
import CartDrawer, { CartProvider } from '@/components/CartDrawer'

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  )
}
