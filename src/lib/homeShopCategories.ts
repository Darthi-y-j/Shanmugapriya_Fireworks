/** Homepage “Shop by Category” row — matches mockup layout. */
export const HOME_SHOP_CATEGORIES = [
  {
    id: 'sparklers',
    name: 'Sparklers',
    slug: 'sparklers',
    image: '/images/home/categories/sparklers.png?v=1',
    keywords: ['sparkler', 'sparklers'],
  },
  {
    id: 'flower-pots',
    name: 'Flower Pots',
    slug: 'flower-pots',
    image: '/images/home/categories/flower-pots.png?v=1',
    keywords: ['flower pot', 'flower pots', 'flowerpot'],
  },
  {
    id: 'chakkars',
    name: 'Chakkars',
    slug: 'chakkars',
    image: '/images/home/categories/chakkars.png?v=1',
    keywords: ['chakkar', 'chakkars', 'ground spinner'],
  },
  {
    id: 'rockets',
    name: 'Rockets',
    slug: 'rockets',
    image: '/images/home/categories/rockets.png?v=1',
    keywords: ['rocket', 'rockets'],
  },
  {
    id: 'aerial-shots',
    name: 'Aerial Shots',
    slug: 'aerial-shots',
    image: '/images/home/categories/aerial-shots.png?v=1',
    keywords: ['aerial', 'sky shot', 'shots'],
  },
  {
    id: 'crackers',
    name: 'Crackers',
    slug: 'crackers',
    image: '/images/home/categories/crackers.png?v=1',
    keywords: ['cracker', 'crackers', 'ladi'],
  },
  {
    id: 'gift-boxes',
    name: 'Gift Boxes',
    slug: 'gift-boxes',
    image: '/images/home/categories/gift-boxes.png?v=1',
    keywords: ['gift', 'combo', 'box'],
  },
] as const

export type HomeShopCategory = (typeof HOME_SHOP_CATEGORIES)[number]
