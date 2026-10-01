"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useCart } from "@/components/CartDrawer"
import { Icon } from "@iconify/react"
import SearchPopdown from "@/components/SearchPopdown"
import AdminLogin from "@/components/AdminLogin"

// logo taps are counted across remounts (clicking the logo navigates home)
let taps = 0
let tapTimer: ReturnType<typeof setTimeout> | undefined

const announcements = [
  "FREE Scent Sleeve Charm With Every Mist",
  "Meet Your New Signature Scents: Solar Skin & After Heat",
]

const topNav = ["YUBHI AYURVEDA", "HOME", "SHOP", "CONTACT"]

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const onLogo = (e: React.MouseEvent) => {
    e.preventDefault()
    clearTimeout(tapTimer)
    taps += 1
    if (taps >= 7) {
      taps = 0
      setLoginOpen(true)
      return
    }
    tapTimer = setTimeout(() => (taps = 0), 1500)
    if (pathname !== "/") router.push("/")
  }
  const cart = useCart()

  return (
    <>
    {/* announcement bar */}
      <div className="overflow-hidden bg-green py-2 text-white">
              <div className="flex w-max animate-marquee whitespace-nowrap">
                {[...Array(2)].map((_, dup) => (
                  <div key={dup} className="flex">
                    {[...announcements, ...announcements, ...announcements].map((a, i) => (
                      <span key={i} className="mx-8 text-[0.875rem] text-white font-bold uppercase tracking-[0.18em]">
                        {a}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
      
            {/* header */}
            <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/95 backdrop-blur">
              <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 md:px-8">
                {/* left nav */}
                <nav className="hidden flex-1 items-center gap-6 lg:flex">
                  {topNav.map((n) => (
                    <a key={n} href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); router.push(n === "SHOP" ? "/shop" : n === "CONTACT" ? "/contact" : "/") }} className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink hover:opacity-60">
                      {n}
                    </a>
                  ))}
                </nav>
      
                {/* mobile menu button */}
                <button
                  className="flex flex-col gap-1.5 lg:hidden"
                  aria-label="Menu"
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  <span className="h-[1.5px] w-6 bg-ink" />
                  <span className="h-[1.5px] w-6 bg-ink" />
                  <span className="h-[1.5px] w-6 bg-ink" />
                </button>
      
                {/* logo */}
                <a href="#" onClick={onLogo} className="shrink-0 select-none font-serif-display text-[26px] font-normal italic tracking-tight md:text-[30px]">
                  yubhi ayurveda
                </a>
      
                {/* right icons */}
                <div className="flex flex-1 items-center justify-end gap-5 text-ink">
                  <button
                    aria-label="Search"
                    onClick={() => { setMenuOpen(false); setSearchOpen(true) }}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-cream"
                  >
                    <Icon
                      icon="solar:magnifier-linear"
                      width="21"
                      height="21"
                      strokeWidth="1.5"
                    />
                  </button>
      
                  <button
                    aria-label="Cart"
                    onClick={() => cart.setOpen(true)}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-cream"
                  >
                    <Icon
                      icon="solar:bag-3-linear"
                      width="21"
                      height="21"
                      strokeWidth="1.5"
                    />
      
                    <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-green px-1 text-[9px] font-semibold text-white">
                      {cart.count}
                    </span>
                  </button>
                </div>
              </div>
      
              <SearchPopdown open={searchOpen} onClose={() => setSearchOpen(false)} />
              <AdminLogin open={loginOpen} onClose={() => setLoginOpen(false)} />

              {/* mobile menu */}
              {menuOpen && (
                <div className="border-t border-ink/10 bg-white lg:hidden">
                  <nav className="flex flex-col px-6 py-4">
                    {topNav.map((n) => (
                      <a key={n} href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); router.push(n === "SHOP" ? "/shop" : n === "CONTACT" ? "/contact" : "/") }} className="border-b border-ink/5 py-3 text-[12px] font-medium uppercase tracking-[0.14em]">
                        {n}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </header>
    </>
  )
}