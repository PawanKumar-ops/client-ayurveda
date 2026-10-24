"use client"

import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
// import { bestSellers, perfumeMists, moodProducts } from '@/lib/products'
import { allProducts } from '@/lib/products'

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
    '3.jpeg',

  gallery2:
    '23.jpeg',

  gallery3:
    '15.jpeg',

  gallery4:
    '13.jpeg',

  gallery5:
    '14.jpeg',

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

const faqs = [
  {
    q: 'What makes Yubhi Ayurveda different?',
    a: 'Yubhi Ayurveda brings the timeless principles of Ayurveda into simple, thoughtful everyday rituals. Our approach focuses on natural ingredients, mindful routines, and care designed for modern living.',
  },

  {
    q: 'Are Yubhi products suitable for everyday use?',
    a: 'Our products are created with everyday rituals in mind, with a focus on gentle, thoughtful care. For specific skin, hair, or wellness concerns, we recommend checking the individual product details and ingredients.',
  },

  {
    q: 'What ingredients do you use?',
    a: 'We focus on thoughtfully selected botanical and naturally derived ingredients inspired by Ayurvedic traditions. Each product page provides more information about the ingredients and their intended use.',
  },

  {
    q: 'How do I choose the right Ayurvedic ritual?',
    a: 'Start with what your daily routine needs most — whether that is hair care, skin care, or everyday wellness. Explore our collections and product details to build a ritual that fits naturally into your lifestyle.',
  },

  {
    q: 'How should I use Yubhi products?',
    a: 'Every product is designed with a simple routine in mind. Follow the usage instructions provided on the individual product page and make it a consistent part of your daily ritual.',
  },

  {
    q: 'Where can I find information about shipping and returns?',
    a: 'You can find the latest information about delivery, shipping, and returns on our Shipping & Returns page. If you have any questions about an order, our team is here to help.',
  },
]

/* ------------------------------- primitives ------------------------------- */

function YellowButton({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full bg-green px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:bg-green-dark ${className}`}
    >
      {children}
    </button>
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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-200 hover:bg-green hover:text-white hover:border-green hover:scale-105"
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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-200 hover:bg-green hover:text-white hover:border-green hover:scale-105"
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

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-cream px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">

        {/* Left */}
        <div className="flex flex-col gap-5 md:sticky md:top-28 md:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green">
            Frequently Asked
          </p>

          <h2 className="font-serif-display text-3xl font-light leading-tight text-ink md:text-[42px]">
            Frequently Asked
            <br />
            Questions
          </h2>

          <p className="max-w-md text-[14px] leading-relaxed text-ink/65">
            Everything you need to know about our rituals, ingredients, and orders.
            Still curious? Our team is always here to help.
          </p>

          <div>
            <YellowButton>Contact Us</YellowButton>
          </div>
        </div>

        {/* FAQ list */}
        <div className="flex flex-col">
          {faqs.map((f, i) => {
            const isOpen = open === i

            return (
              <div
                key={f.q}
                className="border-b border-green/15"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[16px] font-medium leading-snug text-ink md:text-[18px]">
                    {f.q}
                  </span>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen
                      ? 'rotate-45 bg-green text-white'
                      : 'border border-green/20 bg-white text-green'
                      }`}
                  >
                    <Icon
                      icon="solar:add-linear"
                      width="18"
                      height="18"
                    />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${isOpen
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-10 text-[14px] leading-relaxed text-ink/65">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

/* ---------------------------------- app ----------------------------------- */

export default function App() {
  const [slide, setSlide] = useState(0)
  const [moodTab, setMoodTab] = useState<'HAIR CARE' | 'LIP CARE'>('HAIR CARE')

  const heroSlides = [
    img.heroDesktop1,
    img.heroDesktop2,
  ]

  return (
    <div className="min-h-screen bg-white text-ink">
      {/* header and announcement bar */}
      <Header />

      {/* hero slideshow */}
      <section className="relative">
        <div className="relative w-full overflow-hidden">
          {heroSlides.map((s, i) => (
            <a
              key={i}
              href="#"
              className={`block transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'absolute inset-0 opacity-0'}`}
            >
              <img
                src={s}
                alt="Ayurvedic wellness"
                className="h-[420px] w-full object-cover object-top md:h-[500px] lg:h-[560px]"
              />
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
            className="rounded-full border border-ink/25 px-6 py-2 text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-green hover:text-white hover:border-green"
          >
            View All
          </a>
        </div>
        <Carousel>
          {allProducts.slice(0, 15).map((p) => (
            <div
              key={p.title}
              className="w-[70%] shrink-0 sm:w-[45%] md:w-[30%] lg:w-[23%]"
            >
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
              <YellowButton>Don&apos;t Mist This</YellowButton>
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
            {allProducts.slice(0, 2).map((p) => (
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
            {allProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.title} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* marquee strip */}
      <section className="overflow-hidden border-y border-green/20 bg-green py-4 text-white">
        <div className="flex w-max animate-marquee-slow whitespace-nowrap">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex items-center">
              {[...Array(6)].flatMap(() => marqueeItems).map((m, i) => (
                <span
                  key={i}
                  className="mx-6 flex items-center gap-6 font-serif-display text-lg italic text-white md:text-2xl"
                >
                  {m}
                  <span className="text-white/40">·</span>
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

      {/* frequently asked questions */}
      <FAQ />

      {/* footer */}
      <Footer />
    </div>
  )
}
