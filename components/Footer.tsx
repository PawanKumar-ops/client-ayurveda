import React from "react"

const footerCols = [
  {
    title: "EXPLORE",
    links: [
      "Sunrise to Starlight Duo",
      "DLT Ice Ice Baby",
      "DLT Sweet Treat",
      "Down to Dusk Set",
      "Dewy Lip Treatment Minis Kit",
      "Champi Sleek Stick",
      "Champi Bond Repair Duo",
      "Moonlight Growth™ Scalp Serum",
      "Champi Hair Oil",
    ],
  },
  {
    title: "KNOW MORE",
    links: [
      "Contact Us",
      "FAQs",
      "Build Your Own Bundle",
      "Report a Bug",
      "Gifting",
      "Ingredients",
      "Refer & Earn",
    ],
  },
  {
    title: "INFO",
    links: [
      "Terms & Conditions",
      "Shipping & Returns",
      "Privacy Policy",
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-footer px-4 py-14 text-cream md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
            {/* brand */}
            <div className="md:col-span-2">
              <div className="font-serif-display text-3xl italic">yubhi ayurveda</div>
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-cream/70">
                A conscious beauty ecosystem founded by @DiipaKhosla. Available worldwide.
              </p>
            </div>

            {footerCols.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/60">{col.title}</h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-[13px] text-cream/80 hover:text-cream">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* stay in the know */}
          <div className="mt-12 border-t border-cream/15 pt-10">
            <div className="grid grid-cols-1 gap-6 md:max-w-md">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/60">Stay in the know</h4>
              <p className="text-[13px] leading-relaxed text-cream/70">
                Join our beauty community to get exclusive access to product pre-launches, behind the scenes content,
                special community only offers. Sign up now to get 10% off your order.
              </p>
              <form
                className="flex items-center gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 rounded-full bg-transparent px-5 py-3 text-[13px] text-cream ring-1 ring-cream/30 placeholder:text-cream/40 focus:outline-none focus:ring-cream/60"
                />
                <button className="rounded-full bg-cream px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-green-dark transition-colors hover:bg-green-soft">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream/15 pt-6 text-[11px] text-cream/50 md:flex-row">
            <span>© yubhi ayurveda IN 2026</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-cream">Instagram</a>
              <a href="#" className="hover:text-cream">TikTok</a>
              <a href="#" className="hover:text-cream">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
  )
}