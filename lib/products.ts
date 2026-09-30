export type Product = {
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

export type ShopProduct = Product & { category: string }

const CDN = 'https://cdn.shopify.com/s/files/1/0638/0634/1341/files/'

export const bestSellers: Product[] = [
  {
    title: 'Ashwagandha Wellness',
    desc: 'Daily Ayurvedic wellness support',
    price: '₹899',
    old: '₹1,099',
    off: '18% OFF',
    img: 'https://india.indewild.com/cdn/shop/files/web_product_MSS_01.jpg?v=1766489292',
  },
  {
    title: 'Amla Hair Oil',
    desc: 'Traditional Ayurvedic hair nourishment',
    price: '₹699',
    old: '₹899',
    off: '22% OFF',
    img: 'https://india.indewild.com/cdn/shop/files/scentstories_01_364287d3-1757-4258-ac74-39a7a8ced82d.jpg?v=1787219732',
  },
  {
    title: 'Herbal Skin Care',
    desc: 'Gentle botanical care for everyday skin',
    price: '₹799',
    old: '₹999',
    off: '20% OFF',
    img: 'https://india.indewild.com/cdn/shop/files/sleekbackset_01.jpg?v=1787912368',
    rating: '4.9',
  },
  {
    title: 'Ayurvedic Wellness Duo',
    desc: 'Two essentials for your daily ritual',
    price: '₹1,299',
    old: '₹1,599',
    off: '19% OFF',
    img: 'https://india.indewild.com/cdn/shop/files/ChampiBondRepairDuo_01.jpg?v=1759919687',
  },
  {
    title: 'Natural Self-Care Set',
    desc: 'Simple Ayurvedic care for everyday living',
    price: '₹1,499',
    old: '₹1,799',
    off: '17% OFF',
    img: 'https://india.indewild.com/cdn/shop/files/champiessentials_01.jpg?v=1787217578',
  },
  {
    title: 'Herbal Hair Care',
    desc: 'Botanical care inspired by Ayurveda',
    price: '₹899',
    old: '₹1,099',
    off: '18% OFF',
    img: 'https://india.indewild.com/cdn/shop/files/web_product_CHAMPI_02_fa7177a2-41de-46f6-ab68-e530b67d964f.jpg?v=1766476168',
  },
  {
    title: 'Natural Skin Balm',
    desc: 'Plant-based nourishment for your skin',
    price: '₹499',
    old: '₹599',
    off: '17% OFF',
    img: 'https://india.indewild.com/cdn/shop/files/og_lip_balm_01.jpg?v=1774419914',
  },
  {
    title: 'Daily Wellness Essentials',
    desc: 'Ayurvedic essentials for your routine',
    price: '₹999',
    old: '₹1,199',
    off: '17% OFF',
    img: 'https://india.indewild.com/cdn/shop/files/slickstick_01.jpg?v=1762254817',
  },
]

export const perfumeMists: Product[] = [
  {
    title: 'Solar Skin Hair & Body Perfume Mist',
    desc: 'Fresh Citrus Breeze',
    price: '₹1,299',
    rating: '4.9',
    img: 'https://india.indewild.com/cdn/shop/files/solarskin_01.jpg?v=1785915799',
  },
  {
    title: 'After Heat Hair & Body Perfume Mist',
    desc: 'Spiced Vanilla Haze',
    price: '₹1,299',
    rating: '4.9',
    img: 'https://india.indewild.com/cdn/shop/files/afterheat_01.jpg?v=1785916350',
  },
]


export const moodProducts: Product[] = [
  {
    title: 'Daily Wellness Ritual',
    desc: 'Simple Ayurvedic care for every day.',
    price: '₹1,299',
    old: '₹1,599',
    off: '19% OFF',
    freeGift: true,
    img: 'https://india.indewild.com/cdn/shop/files/solar_after_01.jpg?v=1786341337',
  },
  {
    title: 'Ayurvedic Hair Care',
    desc: 'Nourishing botanical hair care.',
    price: '₹899',
    freeGift: true,
    img: 'https://india.indewild.com/cdn/shop/files/solarskin_01.jpg?v=1785915799',
  },
  {
    title: 'Natural Skin Care',
    desc: 'Gentle care inspired by Ayurveda.',
    price: '₹799',
    freeGift: true,
    img: 'https://india.indewild.com/cdn/shop/files/afterheat_01.jpg?v=1785916350',
  },
]

export const hairAndBody: Product[] = [
  { title: 'After Heat Hair & Body Perfume Mist', desc: 'A warm, lingering scent for hair and skin', price: '₹1,299', img: CDN + 'afterheat_01.jpg' },
  { title: 'AM+PM', desc: 'Your day-to-night hair ritual', price: '₹3,349', old: '₹3,940', img: CDN + 'AM_PM.jpg' },
  { title: 'Chai on Call', desc: 'A cosy duo for lips and body', price: '₹1,230', old: '₹1,448', img: CDN + 'IMG_9691.jpg' },
  { title: 'Champi Bond Repair Conditioner', desc: 'Softens and repairs damaged hair', price: '₹1,092', old: '₹1,150', img: CDN + 'conditioner_01_5085a0eb-f7ff-41ed-b646-f8cc0e3f2102.jpg' },
  { title: 'Champi Bond Repair Duo', desc: 'Shampoo and conditioner for stronger hair', price: '₹1,955', old: '₹2,300', img: CDN + 'ChampiBondRepairDuo_01.jpg' },
  { title: 'Champi Bond Repair Shampoo', desc: 'Gentle cleanse, rebuilt bonds', price: '₹1,092', old: '₹1,150', img: CDN + 'shampoo_01_73335608-8d40-4ffe-bb0d-6f9d39ce6324.jpg' },
  { title: 'Champi Essentials Kit', desc: 'Everything for the perfect champi', price: '₹1,499', old: '₹1,899', img: CDN + 'champiessentials_01.jpg' },
  { title: 'Champi Hair Oil', desc: 'Ayurvedic oil for scalp and roots', price: '₹355', img: CDN + 'Updated_1st_image_2.jpg' },
]

export const allProducts: ShopProduct[] = [
  ...bestSellers.map((p) => ({ ...p, category: 'Wellness' })),
  ...perfumeMists.map((p) => ({ ...p, category: 'Perfume Mists' })),
  ...moodProducts.map((p) => ({ ...p, category: 'Rituals' })),
  ...hairAndBody.map((p) => ({ ...p, category: 'Hair & Body' })),
]
