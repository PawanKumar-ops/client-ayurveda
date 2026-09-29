"use client"

import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'

const img = {
  // HERO
  heroDesktop1:
    'https://img.magnific.com/free-photo/young-beautiful-sexy-woman-tropical-garden-summer-vacation-thailand-slim-skinny-tanned-body-little-black-dress-with-lace-natural-look-sensual-relaxed_285396-6239.jpg?t=st=1790668952~exp=1790672552~hmac=2063e122b694a1cb1746e4672409ac881ae495e37e3cffdc7b0655f7a08ae432&w=1480',
  heroMobile1:
    'https://india.indewild.com/cdn/shop/files/homepage_banner_perfume_mists_mb_640_x_840_1.jpg?v=1786434313',

  heroDesktop2:
    'https://img.magnific.com/free-photo/top-view-cup-tea-with-black-tea-dried-flowers-dark-brown-background-tea-fruit-water-color-breakfast-ceremony-photo_140725-160816.jpg?t=st=1790671871~exp=1790675471~hmac=6e11d1eb355b73745bc9b26e9c8ffee25d95a325c6c965cc7ec996f1eae58e2b&w=1480',
  heroMobile2:
    'https://india.indewild.com/cdn/shop/files/homepage_banner_perfume_mists_mb_640_x_840_2.jpg?v=1786938875',

  // BEST SELLERS
  mysteryBox:
    'https://india.indewild.com/cdn/shop/files/web_product_MSS_01.jpg?v=1766489292',

  scentStories:
    'https://india.indewild.com/cdn/shop/files/scentstories_01_364287d3-1757-4258-ac74-39a7a8ced82d.jpg?v=1787219732',

  sleekBackSet:
    'https://india.indewild.com/cdn/shop/files/sleekbackset_01.jpg?v=1787912368',

  growRepairDuo:
    'https://india.indewild.com/cdn/shop/files/ChampiBondRepairDuo_01.jpg?v=1759919687',

  selfCareStaples:
    'https://india.indewild.com/cdn/shop/files/champiessentials_01.jpg?v=1787217578',

  champiHairOil:
    'https://india.indewild.com/cdn/shop/files/web_product_CHAMPI_02_fa7177a2-41de-46f6-ab68-e530b67d964f.jpg?v=1766476168',

  dewyLipTreatment:
    'https://india.indewild.com/cdn/shop/files/og_lip_balm_01.jpg?v=1774419914',

  champiSleekStick:
    'https://india.indewild.com/cdn/shop/files/slickstick_01.jpg?v=1762254817',

  // GALLERY
  gallery1:
    'https://india.indewild.com/cdn/shop/files/scentstories_01_364287d3-1757-4258-ac74-39a7a8ced82d.jpg?v=1787219732',

  gallery2:
    'https://india.indewild.com/cdn/shop/files/champiessentials_01.jpg?v=1787217578',

  gallery3:
    'https://india.indewild.com/cdn/shop/files/slickstick_01.jpg?v=1762254817',

  gallery4:
    'https://india.indewild.com/cdn/shop/files/130ml_mss_1_1.jpg?v=1777738270',

  gallery5:
    'https://india.indewild.com/cdn/shop/files/DLT_WR_1.jpg?v=1774435601',

  // INGREDIENTS
  tangerine:
    'https://img.magnific.com/free-photo/top-view-tasty-juicy-tangerines-dark-background_140725-141003.jpg?t=st=1790670251~exp=1790673851~hmac=0c046515ec2b2095a69508231959eae8c114f62377b04658ab5077d6ae360ce1&w=1480',

  jasmine:
    'https://img.magnific.com/free-photo/bouquet-snowdrops-blurred-background_169016-30299.jpg?t=st=1790670329~exp=1790673929~hmac=e1b9d3bd854924ea73686773d16037f78b23242f36253788bed78c2aed0e8363&w=1480',

  cedarwood:
    'https://img.magnific.com/free-photo/top-close-view-pinecones-pine-branches-beige-shawl-dark-surface_140725-62647.jpg?t=st=1790670393~exp=1790673993~hmac=f82feecfa02cdddcc0d27e7809086b4983280bf03ed27d96bc4fa1123d9734ad&w=1480',

  // PERFUME MISTS
  solarSkin:
    'https://india.indewild.com/cdn/shop/files/solarskin_01.jpg?v=1785915799',

  afterHeat:
    'https://india.indewild.com/cdn/shop/files/afterheat_01.jpg?v=1785916350',

  solarAfter:
    'https://india.indewild.com/cdn/shop/files/solar_after_01.jpg?v=1786341337',

  // CATEGORIES
  skinCare:
    'https://img.magnific.com/free-photo/close-up-portrait-woman-with-hydrated-skin_23-2149432176.jpg?t=st=1790672522~exp=1790676122~hmac=3c9c8b2146c9aaa3cfb235b22b98eef7356ec2be0beb7d3090e2f9b7bc93d80f&w=1480',

  hairCare:
    'https://img.magnific.com/free-photo/young-man-applying-anti-dandruff-product_23-2149345780.jpg?t=st=1790672270~exp=1790675870~hmac=93a34202dd130143d2b318c8fbbe19d03e29fe677e69e62b503f418aaa1f9166&w=1480',

  lipCare:
    'https://img.magnific.com/free-photo/close-up-portrait-woman-with-hydrated-skin_23-2149432230.jpg?t=st=1790672446~exp=1790676046~hmac=a7c93ea18b76d961f514e79ad92d570533b3b978cd50ba00f6048bac6dd5863c&w=1480',

  // OTHER BANNERS
  ritualBanner:
    'https://img.magnific.com/free-photo/wooden-spoons-with-plants-top-view_23-2149339713.jpg?t=st=1790670038~exp=1790673638~hmac=9ee14bc009404c65c74d760507990c0fe97c75f3e71ee495b092bdb7f9c46d41&w=1480',

  perfumeMistsBanner:
    'https://img.magnific.com/free-photo/high-angle-tea-set-up-with-lime-mint_23-2148750225.jpg?t=st=1790671049~exp=1790674649~hmac=685a16e6bc7b7b86d6546c246426b6947aab093a35f9a26678f884818e148b59&w=1480',

  summerMists:
    'https://img.magnific.com/free-photo/aromatic-oil-diffuser-bottle-spa-product_53876-134407.jpg?t=st=1790672802~exp=1790676402~hmac=e7fa771c57f4e27076b7fcb52a2dc29f108376cdbf05618d97b7179b6d3f1c2b&w=1480',

  beforeAfter:
    'https://img.magnific.com/free-photo/we-are-always-good-mood_329181-8497.jpg?t=st=1790673147~exp=1790676747~hmac=b253adde650c332fcb55296de8375b84e8db062d7eee6cf5d14c47a9aa6680f4&w=1480',

  // PRESS
  vogue:
    'https://india.indewild.com/cdn/shop/files/2560px-VOGUE_LOGO_1.png?v=1727777152',

  forbes:
    'https://india.indewild.com/cdn/shop/files/forbes-lisa-barnett-founder-consumer-brands-entrepreneur-24_1.png?v=1727777198',

  popsugar:
    'https://india.indewild.com/cdn/shop/files/PS23_POPSUGAR_LOGO_BLACK_1.png?v=1727777257',
}

/* ---------------------------------- data ---------------------------------- */

const announcements = [
  'FREE Scent Sleeve Charm With Every Mist',
  'Meet Your New Signature Scents: Solar Skin & After Heat',
]

const topNav = ['YUBHI AYURVEDA', 'HOME', 'SHOP', 'CONTACT']

const bestSellers = [
  {
    title: 'Ashwagandha Wellness',
    desc: 'Daily Ayurvedic wellness support',
    price: '₹899',
    old: '₹1,099',
    off: '18% OFF',
    img: img.mysteryBox,
  },
  {
    title: 'Amla Hair Oil',
    desc: 'Traditional Ayurvedic hair nourishment',
    price: '₹699',
    old: '₹899',
    off: '22% OFF',
    img: img.scentStories,
  },
  {
    title: 'Herbal Skin Care',
    desc: 'Gentle botanical care for everyday skin',
    price: '₹799',
    old: '₹999',
    off: '20% OFF',
    img: img.sleekBackSet,
    rating: '4.9',
  },
  {
    title: 'Ayurvedic Wellness Duo',
    desc: 'Two essentials for your daily ritual',
    price: '₹1,299',
    old: '₹1,599',
    off: '19% OFF',
    img: img.growRepairDuo,
  },
  {
    title: 'Natural Self-Care Set',
    desc: 'Simple Ayurvedic care for everyday living',
    price: '₹1,499',
    old: '₹1,799',
    off: '17% OFF',
    img: img.selfCareStaples,
  },
  {
    title: 'Herbal Hair Care',
    desc: 'Botanical care inspired by Ayurveda',
    price: '₹899',
    old: '₹1,099',
    off: '18% OFF',
    img: img.champiHairOil,
  },
  {
    title: 'Natural Skin Balm',
    desc: 'Plant-based nourishment for your skin',
    price: '₹499',
    old: '₹599',
    off: '17% OFF',
    img: img.dewyLipTreatment,
  },
  {
    title: 'Daily Wellness Essentials',
    desc: 'Ayurvedic essentials for your routine',
    price: '₹999',
    old: '₹1,199',
    off: '17% OFF',
    img: img.champiSleekStick,
  },
]

const galleryImages = [
  img.gallery1,
  img.gallery2,
  img.gallery3,
  img.gallery4,
  img.gallery5,
]

const wellnessHighlights = [
  {
    name: 'Tangerine',
    img: img.tangerine,
  },
  {
    name: 'Jasmine',
    img: img.jasmine,
  },
  {
    name: 'Cedarwood',
    img: img.cedarwood,
  },
]

const perfumeMists = [
  {
    title: 'Solar Skin Hair & Body Perfume Mist',
    desc: 'Fresh Citrus Breeze',
    price: '₹1,299',
    rating: '4.9',
    img: img.solarSkin,
  },
  {
    title: 'After Heat Hair & Body Perfume Mist',
    desc: 'Spiced Vanilla Haze',
    price: '₹1,299',
    rating: '4.9',
    img: img.afterHeat,
  },
]


const moodProducts = [
  {
    title: 'Daily Wellness Ritual',
    desc: 'Simple Ayurvedic care for every day.',
    price: '₹1,299',
    old: '₹1,599',
    off: '19% OFF',
    freeGift: true,
    img: img.solarAfter,
  },
  {
    title: 'Ayurvedic Hair Care',
    desc: 'Nourishing botanical hair care.',
    price: '₹899',
    freeGift: true,
    img: img.solarSkin,
  },
  {
    title: 'Natural Skin Care',
    desc: 'Gentle care inspired by Ayurveda.',
    price: '₹799',
    freeGift: true,
    img: img.afterHeat,
  },
]

const marqueeItems = ['Simplified Ayurveda.', 'Advanced Biochemistry.', 'Clinically Backed.']

const categories = [
  {
    name: 'HAIR CARE',
    img: img.hairCare,
  },
  {
    name: 'SKIN CARE',
    img: img.skinCare,
  },
  {
    name: 'LIP CARE',
    img: img.lipCare,
  },
]

const pressLogos = [
  { name: 'VOGUE', img: img.vogue },
  { name: 'Forbes', img: img.forbes },
  { name: 'POPSUGAR', img: img.popsugar },
]

const footerCols = [
  {
    title: 'EXPLORE',
    links: [
      'Sunrise to Starlight Duo',
      'DLT Ice Ice Baby',
      'DLT Sweet Treat',
      'Down to Dusk Set',
      'Dewy Lip Treatment Minis Kit',
      'Champi Sleek Stick',
      'Champi Bond Repair Duo',
      'Moonlight Growth™ Scalp Serum',
      'Champi Hair Oil',
    ],
  },
  {
    title: 'KNOW MORE',
    links: ['Contact Us', 'FAQs', 'Build Your Own Bundle', 'Report a Bug', 'Gifting', 'Ingredients', 'Refer & Earn'],
  },
  {
    title: 'INFO',
    links: ['Terms & Conditions', 'Shipping & Returns', 'Privacy Policy'],
  },
]

/* ------------------------------- primitives ------------------------------- */

function Stars({ value = '4.9' }: { value?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-ink/70">
      <span className="tracking-[-1px] text-[#e7c200]">★★★★★</span>
      <span>{value}</span>
    </span>
  )
}

function YellowButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full bg-yellow px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-yellow-soft ${className}`}
    >
      {children}
    </button>
  )
}

function ProductCard({
  p,
}: {
  p: {
    title: string
    desc: string
    price: string
    old?: string
    off?: string
    img: string
    rating?: string
    freeGift?: boolean
    newBadge?: boolean
  }
}) {
  return (
    <div className="group flex w-full flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-cream-soft">
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {p.newBadge && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink">
              New
            </span>
          )}
          {p.off && (
            <span className="rounded-full bg-yellow px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink">
              {p.off}
            </span>
          )}
          {p.freeGift && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink">
              Free Gift
            </span>
          )}
        </div>
        <img
          src={p.img}
          alt={p.title}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="pointer-events-auto rounded-full bg-ink py-3 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-white">
            Add to cart
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        <h3 className="text-[15px] font-medium leading-snug text-ink">{p.title}</h3>
        <p className="mt-1 text-[12px] leading-snug text-ink/55">{p.desc}</p>
        {p.rating && (
          <div className="mt-1.5">
            <Stars value={p.rating} />
          </div>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[15px] font-medium text-ink">{p.price}</span>
          {p.old && <span className="text-[12px] text-ink/40 line-through">{p.old}</span>}
        </div>
      </div>
    </div>
  )
}

function Carousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: 'smooth' })
  }
  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2 md:gap-6">
        {children}
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-200 hover:bg-yellow hover:scale-105"
        >
          <Icon
            icon="solar:arrow-left-linear"
            width="20"
            height="20"
          />
        </button>

        <button
          onClick={() => scroll(1)}
          aria-label="Next"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-200 hover:bg-yellow hover:scale-105"
        >
          <Icon
            icon="solar:arrow-right-linear"
            width="20"
            height="20"
          />
        </button>
      </div>
    </div>
  )
}

/* ---------------------------------- app ----------------------------------- */

export default function App() {
  const [slide, setSlide] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [moodTab, setMoodTab] = useState<'HAIR CARE' | 'LIP CARE'>('HAIR CARE')

  const heroSlides = [
    {
      dk: img.heroDesktop1,
      mb: img.heroMobile1,
    },
    {
      dk: img.heroDesktop2,
      mb: img.heroMobile2,
    },
  ]

  return (
    <div className="min-h-screen bg-white text-ink">
      {/* announcement bar */}
      <div className="overflow-hidden bg-[#fde877] py-2 text-white">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex">
              {[...announcements, ...announcements, ...announcements].map((a, i) => (
                <span key={i} className="mx-8 text-[0.875rem] text-[#545454] font-bold uppercase tracking-[0.18em]">
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
              <a key={n} href="#" className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink hover:opacity-60">
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
          <a href="#" className="shrink-0 font-serif-display text-[26px] font-normal italic tracking-tight md:text-[30px]">
            yubhi ayurveda
          </a>

          {/* right icons */}
          <div className="flex flex-1 items-center justify-end gap-5 text-ink">
            <button
              aria-label="Search"
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
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-cream"
            >
              <Icon
                icon="solar:bag-3-linear"
                width="21"
                height="21"
                strokeWidth="1.5"
              />

              <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-green px-1 text-[9px] font-semibold text-white">
                0
              </span>
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div className="border-t border-ink/10 bg-white lg:hidden">
            <nav className="flex flex-col px-6 py-4">
              {topNav.map((n) => (
                <a key={n} href="#" className="border-b border-ink/5 py-3 text-[12px] font-medium uppercase tracking-[0.14em]">
                  {n}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* hero slideshow */}
      <section className="relative">
        <div className="relative w-full overflow-hidden">
          {heroSlides.map((s, i) => (
            <a
              key={i}
              href="#"
              className={`block transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'absolute inset-0 opacity-0'}`}
            >
              <picture>
                <source
                  media="(min-width: 750px)"
                  srcSet={s.dk}
                />

                <img
                  src={s.mb}
                  alt="Ayurvedic wellness"
                  className="h-[420px] w-full object-cover object-top md:h-[500px] lg:h-[560px]"
                />
              </picture>
            </a>
          ))}

          {/* arrows */}
          <button
            onClick={() => setSlide((slide + heroSlides.length - 1) % heroSlides.length)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-ink backdrop-blur transition-all duration-200 hover:bg-white md:left-6 md:h-11 md:w-11"
          >
            <Icon
              icon="solar:arrow-left-linear"
              width="20"
              height="20"
            />
          </button>

          <button
            onClick={() => setSlide((slide + 1) % heroSlides.length)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-ink backdrop-blur transition-all duration-200 hover:bg-white md:right-6 md:h-11 md:w-11"
          >
            <Icon
              icon="solar:arrow-right-linear"
              width="20"
              height="20"
            />
          </button>

          {/* dots */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`View slide ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full border border-ink/60 transition-colors ${i === slide ? 'bg-ink' : 'bg-transparent'}`}
              />
            ))}
          </div>
        </div>

      </section>

      {/* best sellers */}
      <section className="mx-auto max-w-[1500px] px-4 py-12 md:px-8 md:py-14">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <h2 className="font-serif-display text-3xl font-light md:text-[40px]">Shop Best-Sellers</h2>
          <a
            href="#"
            className="rounded-full border border-ink/25 px-6 py-2 text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-yellow"
          >
            View All
          </a>
        </div>
        <Carousel>
          {bestSellers.map((p) => (
            <div key={p.title} className="w-[70%] shrink-0 sm:w-[45%] md:w-[30%] lg:w-[23%]">
              <ProductCard p={p} />
            </div>
          ))}
        </Carousel>
      </section>

      {/* find your ayurvedic ritual */}
      <section className="grid grid-cols-1 items-stretch md:grid-cols-2">
        <div className="min-h-[320px]">
          <img
            src={img.ritualBanner}
            alt="Scent sleeve charm"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-5 bg-cream px-6 py-14 md:px-16">
          <h2 className="font-serif-display text-3xl font-light md:text-[38px]">Find Your Ayurvedic Ritual</h2>
          <p className="max-w-md text-[14px] leading-relaxed text-ink/70">
            From hair care and skin nourishment to everyday wellness, discover
            thoughtfully crafted Ayurvedic essentials made to fit into your daily
            routine.
          </p>
          <div>
            <YellowButton>Shop All Products</YellowButton>
          </div>
        </div>
      </section>

      {/* shop the look gallery */}
      <section className="px-2 py-4 md:px-4 md:py-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar md:gap-3">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-[3/4] w-[45%] shrink-0 overflow-hidden rounded-xl sm:w-[30%] md:w-[19%]"
            >
              <img src={img} alt="Lifestyle" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-end justify-center bg-black/0 p-3 transition-colors group-hover:bg-black/20">
                <span className="translate-y-2 rounded-full bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  Shop the look
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* fresh & gentle ingredients */}
      <section className="bg-cream px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 flex flex-col gap-5">
            <h2 className="font-serif-display text-3xl font-light leading-tight md:text-[42px]">
              Fresh &amp; Gentle
              <br />
              Ingredients
            </h2>
            <p className="max-w-md text-[14px] leading-relaxed text-ink/70">
              Lightweight, non-drying formula, made with naturally derived ingredients, perfect for everyday use.
            </p>
            <div>
              <YellowButton>Don't Mist This</YellowButton>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {wellnessHighlights.map((item) => (
              <figure key={item.name} className="flex flex-col items-center gap-4">
                <div className="w-full overflow-hidden rounded-2xl bg-white">
                  <img src={item.img} alt={item.name} className="aspect-[3/4] w-full object-cover" />
                </div>
                <figcaption className="font-serif-display text-lg italic text-ink">{item.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* perfume mists feature */}
      <section className="grid grid-cols-1 items-stretch md:grid-cols-2">
        <div className="min-h-[360px]">
          <img
            src={img.perfumeMistsBanner}
            alt="Perfume mists"
            className="h-full w-full max-h-[900px] object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-6 px-6 py-14 md:px-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/60">Shop The Perfume Mists</p>
          <div className="grid grid-cols-2 gap-5">
            {perfumeMists.map((p) => (
              <ProductCard key={p.title} p={{ ...p, newBadge: true, freeGift: true }} />
            ))}
          </div>
        </div>
      </section>

      {/* ayurvedic philosophy */}
      <section className="border-y border-ink/10 bg-cream px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1100px] text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
            Our Approach
          </p>

          <h2 className="font-serif-display text-3xl font-light leading-tight md:text-[42px]">
            Rooted in Ayurveda.
            <br />
            Made for Everyday Rituals.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[14px] leading-relaxed text-ink/65">
            We bring traditional Ayurvedic principles into simple, thoughtful
            everyday care — with a focus on natural ingredients, mindful routines,
            and products designed for modern living.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3">
              <Icon
                icon="solar:leaf-linear"
                width="30"
                height="30"
                className="text-green"
              />
              <h3 className="font-serif-display text-lg">
                Inspired by Nature
              </h3>
              <p className="max-w-xs text-[12px] leading-relaxed text-ink/55">
                Thoughtfully selected botanical ingredients inspired by traditional
                wellness practices.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Icon
                icon="solar:heart-pulse-linear"
                width="30"
                height="30"
                className="text-green"
              />
              <h3 className="font-serif-display text-lg">
                Mindful Formulation
              </h3>
              <p className="max-w-xs text-[12px] leading-relaxed text-ink/55">
                Created with a simple approach to everyday personal care and
                wellness.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Icon
                icon="solar:sun-2-linear"
                width="30"
                height="30"
                className="text-green"
              />
              <h3 className="font-serif-display text-lg">
                Everyday Rituals
              </h3>
              <p className="max-w-xs text-[12px] leading-relaxed text-ink/55">
                Easy-to-use essentials that fit naturally into your daily routine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* mist for every mood */}
      <section className="px-4 py-14 md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="font-serif-display text-3xl font-light md:text-[40px]">Mist for every mood</h2>
              <p className="mt-2 text-[14px] text-ink/60">Natural &amp; non-drying, perfect for everyday.</p>
            </div>
            <div className="flex gap-6">
              {(['HAIR CARE', 'LIP CARE'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setMoodTab(t)}
                  className={`pb-1 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${moodTab === t ? 'border-b-2 border-ink text-ink' : 'text-ink/40'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
            <a href="#" className="group relative overflow-hidden rounded-2xl md:row-span-1">
              <img
                src={img.summerMists}
                alt="Discover your scent"
                className="h-full sm:min-h-[517px] min-h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
                Discover your scent
              </span>
            </a>
            {moodProducts.map((p) => (
              <ProductCard key={p.title} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* marquee strip */}
      <section className="overflow-hidden border-y border-ink/10 bg-yellow py-4">
        <div className="flex w-max animate-marquee-slow whitespace-nowrap">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex items-center">
              {[...Array(6)].flatMap(() => marqueeItems).map((m, i) => (
                <span key={i} className="mx-6 flex items-center gap-6 font-serif-display text-lg italic md:text-2xl">
                  {m}
                  <span className="text-ink/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* categories */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        {categories.map((c) => (
          <a key={c.name} href="#" className="group relative block overflow-hidden">
            <img
              src={c.img}
              alt={c.name}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute bottom-6 left-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-white drop-shadow">
              {c.name}
            </span>
          </a>
        ))}
      </section>

      {/* quote + press */}
      {/* brand philosophy */}
<section className="bg-cream px-4 py-16 md:px-8 md:py-24">
  <div className="mx-auto max-w-[900px] text-center">
    <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
      The Yubhi Philosophy
    </p>

    <blockquote className="font-serif-display text-2xl font-light leading-snug md:text-[34px]">
      &ldquo;Rooted in the timeless wisdom of Ayurveda, we bring
      thoughtful rituals and nature-inspired care into everyday life.&rdquo;
    </blockquote>
  </div>
</section>

      {/* reviews */}
      <section className="grid grid-cols-1 items-center gap-8 px-4 py-14 md:grid-cols-2 md:px-8">
        <div className="flex flex-col items-start gap-5 md:pl-12">
          <div className="flex items-center gap-3">
            <span className="font-serif-display text-4xl md:text-5xl">500,000+</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl tracking-[-2px] text-[#e7c200]">★★★★★</span>
            <span className="text-lg">reviews</span>
          </div>
          <YellowButton>Read All Reviews</YellowButton>
        </div>
        <div>
          <img
            src={img.beforeAfter}
            alt="Before and afters"
            className="w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      {/* footer */}
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
                <button className="rounded-full bg-yellow px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink hover:bg-yellow-soft">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream/15 pt-6 text-[11px] text-cream/50 md:flex-row">
            <span>© indē wild IN 2026</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-cream">Instagram</a>
              <a href="#" className="hover:text-cream">TikTok</a>
              <a href="#" className="hover:text-cream">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
