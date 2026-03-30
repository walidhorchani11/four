export type ProductBadgeKey = 'popular' | 'bestseller' | 'premium'

export type ProductCatalogItem = {
  id: string
  /** Libellé FR pour persistance serveur / admin */
  nameFr: string
  image: string
  price: string
  oldPrice?: string
  badge?: ProductBadgeKey
}

export const productsCatalog: ProductCatalogItem[] = [
  {
    id: 'four_1_etage',
    nameFr: 'Four 1 étage',
    image: '/images/four1.jpg',
    price: '1100',
    badge: 'popular',
  },
  {
    id: 'four_2_etages',
    nameFr: 'Four 2 étages',
    image: '/images/four-2-etage.jpg',
    price: '1300',
    oldPrice: '1350',
    badge: 'bestseller',
  },
  {
    id: 'four_3_etages',
    nameFr: 'Four 3 étages',
    image: '/images/four-3-etage.jpeg',
    price: '1500',
    oldPrice: '1650',
    badge: 'premium',
  },
]
