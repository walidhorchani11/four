export type ProductCatalogItem = {
  id: string
  name: string
  price: string
  oldPrice?: string
  image: string
  capacity?: string
  usage?: string
  gasType?: string
  features?: string[]
  badge?: string
}

export const productsCatalog: ProductCatalogItem[] = [
  {
    id: 'four_1_etage',
    name: 'Four 1 étage',
    image: '/images/four1.jpg',
    price: '1100',
    // oldPrice intentionally optional (if you want to display it)
    capacity: '1 étage',
    usage: 'Usage domestique',
    gasType: 'Butane/Propane',
    features: ['Chauffe rapide', 'Compact', 'Facile a installer'],
    badge: 'Populaire',
  },
  {
    id: 'four_2_etages',
    name: 'Four 2 étages',
    image: '/images/four-2-etage.jpg',
    price: '1300',
    oldPrice: '1350',
    capacity: '2 étages',
    usage: 'Maison & Commerce',
    gasType: 'Butane/Propane',
    features: ['Grande capacite', 'Multi-niveaux', 'Usage intensif'],
    badge: 'Meilleure vente',
  },
  {
    id: 'four_3_etages',
    name: 'Four 3 étages',
    image: '/images/four-3-etage.jpeg',
    price: '1500',
    oldPrice: '1650',
    capacity: '3 étages',
    usage: 'Pizzeria & Boulangerie',
    gasType: 'Butane/Propane',
    features: ['Pierre refractaire', 'Haute temperature', 'Pro'],
    badge: 'Premium',
  },
]

