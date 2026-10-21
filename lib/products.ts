
export type Product = {
  id: string
  slug: string
  title: string
  desc: string
  price: string
  old?: string
  off?: string
  img: string
  images?: string[]
  category: string
  reviewCount?: number
  freeGift?: boolean
  newBadge?: boolean
  featured?: boolean
  size?: string
  description?: string
  benefits?: string[]
  ingredients?: string[]
  howToUse?: string
  faqs?: { q: string; a: string }[]
}

export type ShopProduct = Product

export const allProducts: ShopProduct[] = [
  {
    id: 'prod-001',
    slug: 'glow-oxygluta-hair-nourishing-cream',
    title: 'Glow Oxygluta Hair Nourishing Cream',
    desc: 'Hair nourishing cream with botanical ingredients and keratin',
    price: '₹',
    img: '1.jpeg',
    images: ['1.jpeg'],
    category: 'Hair Care',
    size: '100 g',
  },
  {
    id: 'prod-002',
    slug: 'glow-oxygluta-anti-acne-kit',
    title: 'Glow Oxygluta Anti-Acne Kit',
    desc: 'Complete skincare kit for acne-prone skin',
    price: '₹',
    img: '2.jpeg',
    images: ['2.jpeg'],
    category: 'Skin Care',
    size: 'Kit',
  },
  {
    id: 'prod-003',
    slug: 'glow-oxygluta-glutathione-peel',
    title: 'Glow Oxygluta Glutathione Peel',
    desc: 'Professional-use glutathione peel',
    price: '₹',
    img: '3.jpeg',
    images: ['3.jpeg'],
    category: 'Skin Care',
    size: '30 ml',
  },
  {
    id: 'prod-004',
    slug: 'glow-oxygluta-rice-water-facewash',
    title: 'Glow Oxygluta Rice Water Facewash',
    desc: 'Rice water facewash with niacinamide, vitamin E and glycerin',
    price: '₹',
    img: '5.jpeg',
    images: ['5.jpeg','39.jpeg','40.jpeg','42.jpeg'],
    category: 'Skin Care',
    size: '100 ml',
  },
  {
  id: 'prod-005',
  slug: 'glow-oxygluta-tinted-sunscreen',
  title: 'Glow Oxygluta Tinted Sunscreen',
  desc: 'Tinted sunscreen with SPF 50++, niacinamide and hyaluronic acid for a dewy, even-looking finish.',
  price: '₹',
  img: '6.jpeg',
  images: ['6.jpeg'],
  category: 'Skin Care',
  size: '50 ml',
},
{
  id: 'prod-006',
  slug: 'slimjim-apple-cider-vinegar-tablet',
  title: 'Slimjim Apple Cider Vinegar Tablet',
  desc: 'Apple cider vinegar tablets with cinnamon and moringa leaf, featuring a refreshing green apple flavour.',
  price: '₹',
  img: '7.jpeg',
  images: ['7.jpeg'],
  category: 'Wellness',
},
{
  id: 'prod-007',
  slug: 'glow-oxygluta-hair-vitalize-serum',
  title: 'Glow Oxygluta Hair Vitalize Serum',
  desc: 'Professional hair serum formulated with Procapil, Redensyl and Anagain to support a healthy-looking hair care routine.',
  price: '₹',
  img: '8.jpeg',
  images: ['8.jpeg'],
  category: 'Hair Care',
  size: '50 ml',
},
{
  id: 'prod-008',
  slug: 'glow-oxygluta-retinol-facewash',
  title: 'Glow Oxygluta Retinol Facewash',
  desc: 'Face wash formulated with collagen peptides, hyaluronic acid, niacinamide and retinol. Designed for a skincare routine focused on skin texture and the appearance of fine lines.',
  price: '₹',
  img: '9.jpeg',
  images: ['9.jpeg','35.jpeg','37.jpeg','38.jpeg'],
  category: 'Skin Care',
  size: '100 ml',
},
{
  id: 'prod-009',
  slug: 'glow-oxygluta-anti-acne-gel',
  title: 'Glow Oxygluta Anti Acne Gel',
  desc: 'Acne-prone skin gel featuring salicylic acid, niacinamide and azelaic acid.',
  price: '₹',
  img: '10.jpeg',
  images: ['10.jpeg'],
  category: 'Skin Care',
  size: '30 g',
},
{
  id: 'prod-010',
  slug: 'glow-oxygluta-glutathione-facial-kit',
  title: 'Glow Oxygluta Glutathione Facial Kit',
  desc: 'Glutathione facial kit with multiple skincare products for a complete facial routine.',
  price: '₹',
  img: '11.jpeg',
  images: ['11.jpeg'],
  category: 'Facial Kits',
  size: '100 g Economy Pack',
},
{
  id: 'prod-011',
  slug: 'glow-oxygluta-honey-malai-face-wash',
  title: 'Glow Oxygluta Honey & Malai Face Wash',
  desc: 'Honey and malai face wash designed for normal to dry skin, with a gentle daily cleansing routine in mind.',
  price: '₹',
  img: '12.jpeg',
  images: ['12.jpeg'],
  category: 'Skin Care',
  size: '100 ml',
},
{
  id: 'prod-012',
  slug: 'glow-oxygluta-hair-mask',
  title: 'Glow Oxygluta Hair Mask',
  desc: 'Nourishing hair mask formulated with biotin, almond oil and aloe vera extract for hair conditioning.',
  price: '₹',
  img: '13.jpeg',
  images: ['13.jpeg'],
  category: 'Hair Care',
  size: '200 ml',
},
{
  id: 'prod-013',
  slug: 'glow-oxygluta-rice-water-combo-kit',
  title: 'Glow Oxygluta Rice Water Combo Kit',
  desc: 'Rice water skincare combo featuring face wash, face cream, face serum and a facial sheet mask.',
  price: '₹',
  img: '14.jpeg',
  images: ['14.jpeg'],
  category: 'Skincare Kits',
  size: 'Combo Kit',
},
{
  id: 'prod-014',
  slug: 'glow-oxygluta-2-percent-salicylic-acid-face-serum',
  title: 'Glow Oxygluta 2% Salicylic Acid Face Serum',
  desc: 'Face serum with 2% salicylic acid, pro-vitamin B5, witch hazel extract and hyaluronic acid for acne-prone skin.',
  price: '₹',
  img: '15.jpeg',
  images: ['15.jpeg'],
  category: 'Skin Care',
  size: '30 ml',
},
{
  id: 'prod-015',
  slug: 'glow-oxygluta-aqua-boost-water-gel',
  title: 'Glow Oxygluta Aqua Boost Water Gel',
  desc: 'Lightweight water gel formulated with Aquaxyl, ceramide, Pentavitin and hyaluronic acid to hydrate skin and support its moisture barrier.',
  price: '₹',
  img: '16.jpeg',
  images: ['16.jpeg'],
  category: 'Skin Care',
  size: 'Check product packaging',
},
{
  id: 'prod-016',
  slug: 'glow-oxygluta-rosemary-water',
  title: 'Glow Oxygluta Rosemary Water',
  desc: 'Leave-in rosemary water spray for the scalp and hair, featuring biotin, panthenol and wheat protein for everyday hair care.',
  price: '₹',
  img: '17.jpeg',
  images: ['17.jpeg'],
  category: 'Hair Care',
  size: '100 ml',
  howToUse: 'Shake well, unlock the pump, mist lightly onto the scalp and hair, then gently massage and style as desired. No rinsing required.',
},
{
  id: 'prod-017',
  slug: 'glow-oxygluta-glutathione-vitamin-c-face-serum',
  title: 'Glow Oxygluta Glutathione Vitamin C Face Serum',
  desc: 'Face serum featuring 2% glutathione, 10% vitamin C, niacinamide and hyaluronic acid for a skincare routine focused on radiance and an even-looking complexion.',
  price: '₹',
  img: '18.jpeg',
  images: ['18.jpeg'],
  category: 'Skin Care',
  size: '30 ml',
},
{
  id: 'prod-018',
  slug: 'glow-oxygluta-anti-aging-combo-kit',
  title: 'Glow Oxygluta Anti-Aging Combo Kit',
  desc: 'A multi-product skincare set featuring marine collagen powder, collagen peptide face serum, Botox cream and a collagen peptide facial sheet mask.',
  price: '₹',
  img: '19.jpeg',
  images: ['19.jpeg'],
  category: 'Skincare Kits',
  size: 'Combo Kit',
},


{
  id: 'prod-019',
  slug: 'glow-oxygluta-hair-growth-tablets',
  title: 'Glow Oxygluta Hair Growth Tablets',
  desc: 'Effervescent tablets formulated with biotin, amino acids, vitamins, minerals and natural extracts for hair, skin and nail care.',
  price: '₹',
  img: '21.jpeg',
  images: ['21.jpeg'],
  category: 'Hair Care',
  size: '15 Tablets',
},
{
  id: 'prod-020',
  slug: 'glow-oxygluta-vitamin-c-20-face-serum',
  title: 'Glow Oxygluta Vitamin C 20% Face Serum',
  desc: 'Professional facial serum featuring 20% vitamin C, hyaluronic acid and vitamin E for a skincare routine focused on radiance and hydration.',
  price: '₹',
  img: '22.jpeg',
  images: ['22.jpeg'],
  category: 'Skin Care',
  size: '30 ml',
},
{
  id: 'prod-021',
  slug: 'glow-oxygluta-anti-hairfall-hair-growth-kit',
  title: 'Glow Oxygluta Anti-Hairfall & Hair Growth Kit',
  desc: 'A multi-product hair care kit featuring hair serum, hair growth tablets, hair nourishing cream, bioferment complex shampoo and conditioner.',
  price: '₹',
  img: '23.jpeg',
  images: ['23.jpeg'],
  category: 'Hair Care Kits',
  size: 'Combo Kit',
},
{
  id: 'prod-022',
  slug: 'glow-oxygluta-milky-sunscreen-spf-50',
  title: 'Glow Oxygluta Milky Sunscreen SPF 50',
  desc: 'Ultra-light sunscreen featuring glutathione, tranexamic acid, ceramide and Clair Blanche-III, designed for broad-spectrum sun protection and hydrated-looking skin.',
  price: '₹',
  img: '24.jpeg',
  images: ['24.jpeg'],
  category: 'Sun Care',
  size: '50 ml',
},
{
  id: 'prod-023',
  slug: 'glow-oxygluta-pigmentation-combo-kit',
  title: 'Glow Oxygluta Pigmentation Combo Kit',
  desc: 'A comprehensive skincare kit featuring effervescent tablets, advanced cream, advanced serum, glutathione vitamin C sheet mask, milky sunscreen and foaming facewash.',
  price: '₹',
  img: '25.jpeg',
  images: ['25.jpeg'],
  category: 'Skincare Kits',
  size: 'Combo Kit',
},


{
  id: 'prod-024',
  slug: 'glow-oxygluta-tinted-sunscreen-spf-50',
  title: 'Glow Oxygluta Tinted Sunscreen SPF 50+++',
  desc: 'Dewy-look tinted sunscreen with niacinamide and hyaluronic acid. Lightweight, non-greasy formula with a natural tint and no-white-cast finish.',
  price: '₹',
  img: '26.jpeg',
  images: ['26.jpeg'],
  category: 'Sun Care',
  size: '50 ml',
},
{
  id: 'prod-025',
  slug: 'glow-oxygluta-sunscreen-spray',
  title: 'Glow Oxygluta Sunscreen Spray',
  desc: 'Convenient spray sunscreen formulated with UV filters and vitamin E. Shake well before use and follow the directions and warnings on the product label.',
  price: '₹',
  img: '27.jpeg',
  images: ['27.jpeg'],
  category: 'Sun Care',
  size: 'Check product label',
},
{
  id: 'prod-026',
  slug: 'glow-oxygluta-glutathione-soap',
  title: 'Glow Oxygluta Glutathione Soap',
  desc: 'Skin-cleansing soap formulated with glutathione, almond oil, cocoa butter and aloe vera.',
  price: '₹',
  img: '29.jpeg',
  images: ['29.jpeg','28.jpeg'],
  category: 'Body Care',
  size: '75 g',
},
{
  id: 'prod-027',
  slug: 'glow-oxygluta-collagen-face-serum',
  title: 'Glow Oxygluta Collagen Face Serum',
  desc: 'Collagen face serum formulated with Cica Exosomes, peptides and hyaluronic acid. Designed to support skin hydration, improve the appearance of skin texture and promote a radiant-looking complexion.',
  price: '₹',
  img: '30.jpeg',
  images: ['30.jpeg','32.jpeg'],
  category: 'Skin Care',
  size: '50ml',
},



{
  id: 'prod-030',
  slug: 'glow-oxygluta-anti-acne-facewash',
  title: 'Glow Oxygluta Anti Acne Facewash',
  desc: 'Face wash formulated with Acne Buster, salicylic acid, glycolic acid and vitamin E. Designed for acne-prone skin to cleanse pores and remove excess oil.',
  price: '₹',
  img: '33.jpeg',
  images: ['33.jpeg','34.jpeg','36.jpeg'],
  category: 'Face Wash',
  size: '100 ml',
},



{
  id: 'prod-035',
  slug: 'day-fairness-cream',
  title: 'Day Fairness Cream',
  desc: 'Day cream formulated with kojic acid, arbutin, vitamin C, aloe vera, glycerin, vitamin E, green tea extract, licorice extract, mulberry extract, Indian kino and sandalwood. Designed for skin pigmentation and the appearance of dark spots.',
  price: '₹',
  img: '41.jpeg',
  images: ['41.jpeg'],
  category: 'Face Cream',
},
{
  id: 'prod-037',
  slug: 'day-fairness-magic-night-cream-combo',
  title: 'Day Fairness Cream + Magic Night Cream Combo',
  desc: 'Complete day and night skincare combo for pigmentation and dark spots. The Day Fairness Cream contains kojic acid, arbutin, vitamin C, aloe vera and botanical extracts. The Magic Night Cream contains aloe vera, coconut oil, shea butter, green tea extract, rosehip oil and lavender oil.',
  price: '₹',
  img: '44.jpeg',
  images: ['44.jpeg'],
  category: 'Face Cream Combo',
},
{
  id: 'prod-039',
  slug: 'yubhi-ayurveda-romashuddhi-powder',
  title: 'Yubhi Ayurveda Romashuddhi Powder',
  desc: 'Handcrafted Ayurvedic Romashuddhi Powder by Dr. Nisha Thakran. A traditional skincare product from Yubhi Ayurveda. Refer to the product packaging or consult the manufacturer for ingredients, directions for use and suitability.',
  price: '₹',
  img: '46.jpeg',
  images: [
    '43.jpeg','46.jpeg'
  ],
  category: 'Ayurvedic Skin Care',
},
{
  id: 'prod-040',
  slug: 'yubhi-ayurveda-crown-silk-pro-advance-collagen-hair-mask',
  title: 'Yubhi Ayurveda Crown Silk Pro Advance Collagen Hair Mask',
  desc: 'Yubhi Ayurveda Crown Silk Pro Advance Collagen Hair Mask, featuring an Italian-inspired formulation. Designed as a hair care treatment. Refer to the product packaging for complete ingredients and directions for use.',
  price: '₹',
  img: '66.jpeg',
  images: [
    '66.jpeg','47.jpeg','63.jpeg','45.jpeg','48.jpeg'
  ],
  category: 'Hair Care',
},
{
  id: 'prod-040',
  slug: 'yubhi-ayurveda-detox-plus-herbal-powder',
  title: 'Yubhi Ayurveda Detox Plus Herbal Powder',
  desc: 'Yubhi Ayurveda Detox Plus is a handmade herbal powder marketed to support digestion and bowel regularity. Formulated with traditional herbal ingredients, including ajwain, amla, gulab phool, licorice and fennel. Manufactured by Dr. Nisha Thakran. Use only as directed by a qualified healthcare professional.',
  price: '₹',
  img: '64.jpeg',
  images: [
    '64.jpeg','61.jpeg','49.jpeg','52.jpeg','53.jpeg','59.jpeg'
  ],
  category: 'Ayurvedic Wellness',
},
{
  id: 'prod-041',
  slug: 'yubhi-ayurveda-crown-silk-collagen-shampoo',
  title: 'Yubhi Ayurveda Crown Silk Collagen Shampoo',
  desc: 'Yubhi Ayurveda Crown Silk Pro Advance Collagen Sulphate-Free Shampoo is designed to gently cleanse the scalp while helping maintain hair softness, smoothness and shine. Enriched with glycerine and Centella Asiatica extract, this 200 ml shampoo is suitable for hair-care routines, including color-treated and chemically treated hair. Formulated in Italy.',
  price: '₹',
  img: '62.jpeg',
  images: [
    '62.jpeg','50.jpeg','51.jpeg','60.jpeg'
  ],
  category: 'Hair Care',
},
{
  id: 'prod-042',
  slug: 'yubhi-ayurveda-alkaline-mineral-drops',
  title: 'Yubhi Ayurveda Alkaline Mineral Drops',
  desc: 'Yubhi Ayurveda Alkaline Mineral Drops is a 30 ml plant-based mineral and antioxidant concentrate containing botanical extracts from barley, green tea, noni, pumpkin seed, grape, cucumber, apricot, alfalfa and dandelion. Enriched with calcium, magnesium and vitamins A, B1, B6 and C, this dietary supplement is marketed to support daily hydration and wellness.',
  price: '₹1999',
  img: '55.jpeg',
  images: [
    '55.jpeg','54.jpeg','56.jpeg','57.jpeg','58.jpeg'
  ],
  category: 'Health & Wellness',
},
{
  id: 'prod-043',
  slug: 'yubhi-ayurveda-crown-silk-collagen-hair-serum',
  title: 'Yubhi Ayurveda Crown Silk Collagen Hair Serum',
  desc: 'Yubhi Ayurveda Crown Silk Pro Advance Collagen Hair Serum is designed to give hair a smooth, glossy and silky finish. Enriched with Vitamin E, coconut oil, macadamia oil and sunflower seed oil, this nourishing serum helps condition hair, improve softness and enhance shine. Its lightweight formula can be applied to damp hair from mid-lengths to ends for a sleek, salon-inspired finish.',
  price: '₹',
  img: '68.jpeg',
  images: [
    '68.jpeg','65.jpeg'
  ],
  category: 'Hair Care',
},
{
  id: 'prod-044',
  slug: 'yubhi-ayurveda-3-in-1-golden-shampoo',
  title: 'Yubhi Ayurveda 3-in-1 Golden Shampoo',
  desc: 'Yubhi Ayurveda 3-in-1 Golden Shampoo is a complete hair-care solution formulated to cleanse, smooth and enhance hair shine. Enriched with keratin, argan oil, biotin and Ayurvedic herbs including amla, reetha, shikakai and bhringraj, it helps manage frizz, improve hair texture and care for dull, damaged-looking hair. Suitable for all hair types, this 500 ml shampoo is designed for regular hair-care routines.',
  price: '₹',
  img: '71.jpeg',
  images: [
    '71.jpeg','70.jpeg','69.jpeg','67.jpeg'
  ],
  category: 'Hair Care',
},
]

export const slugify = (title: string) =>
  title.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const findProduct = (slug: string) =>
  allProducts.find((p) => p.slug === slug)

export const lifestyleShots = [
  {
    label: 'The Reset',
    img: 'https://img.magnific.com/free-photo/young-man-applying-anti-dandruff-product_23-2149345780.jpg?w=1480',
  },
  {
    label: 'A Deep Cleanse',
    img: 'https://img.magnific.com/free-photo/wooden-spoons-with-plants-top-view_23-2149339713.jpg?w=1480',
  },
]

export const productDetails = (p: ShopProduct) => ({
  about: p.description || p.desc,
  benefits: p.benefits || [],
  size: p.size || 'See product packaging',
  userResults: [],
  ingredients: p.ingredients || [],
  howToUse: p.howToUse || '',
  clinical: [],
  info: p.faqs?.map((f) => ({
    q: f.q,
    a: f.a,
  })) || [],
})
