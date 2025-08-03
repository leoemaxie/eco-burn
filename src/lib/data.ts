export type Tutorial = {
  id: string;
  title: string;
  description: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  imageUrl: string;
  videoUrl?: string;
};

export const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'DIY: Turn Old Capacitors into Jewelry',
    description:
      'A simple guide to creating stunning, unique earrings and pendants from discarded capacitors. No soldering required!',
    skillLevel: 'Beginner',
    imageUrl: 'https://placehold.co/600x400',
  },
  {
    id: '2',
    title: 'Build a USB Phone Charger from a 9V Battery',
    description:
      'Learn basic circuit principles to build a portable phone charger. A great introduction to practical electronics.',
    skillLevel: 'Intermediate',
    imageUrl: 'https://placehold.co/600x400',
  },
  {
    id: '3',
    title: 'Advanced: Create a Persistence of Vision (POV) Display',
    description:
      'Use an old CPU fan, resistors, and LEDs to build a mesmerizing POV display that writes messages in the air.',
    skillLevel: 'Advanced',
    imageUrl: 'https://placehold.co/600x400',
  },
  {
    id: '4',
    title: 'Make a Desk Lamp from a Broken Hard Drive',
    description:
      'Repurpose the shiny platters and sturdy arm of an old HDD into a stylish, industrial-chic desk lamp.',
    skillLevel: 'Intermediate',
    imageUrl: 'https://placehold.co/600x400',
  },
  {
    id: '5',
    title: 'Simple Wire Art from Copper Coils',
    description:
      'Unwind coils from old transformers and motors to create beautiful wire sculptures and decorative pieces for your home.',
    skillLevel: 'Beginner',
    imageUrl: 'https://placehold.co/600x400',
  },
  {
    id: '6',
    title: 'Build a Bluetooth Speaker from an Old Radio',
    description:
      'Retrofit a vintage radio casing with modern Bluetooth components and speakers for a blend of old and new.',
    skillLevel: 'Advanced',
    imageUrl: 'https://placehold.co/600x400',
  },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  seller: string;
};

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Circuit Board Coasters (Set of 4)',
    price: 19.99,
    imageUrl: 'https://placehold.co/400x400',
    seller: 'EcoElecCreations',
  },
  {
    id: 'p2',
    name: 'Steampunk Resistor Earrings',
    price: 24.5,
    imageUrl: 'https://placehold.co/400x400',
    seller: 'GadgetGems',
  },
  {
    id: 'p3',
    name: 'HDD Platter Wall Clock',
    price: 45.0,
    imageUrl: 'https://placehold.co/400x400',
    seller: 'ReclaimedTech',
  },
  {
    id: 'p4',
    name: 'Refurbished 1TB Seagate HDD',
    price: 35.0,
    imageUrl: 'https://placehold.co/400x400',
    seller: 'PartsPalace',
  },
   {
    id: 'p5',
    name: 'Upcycled Keyboard Key Art',
    price: 55.99,
    imageUrl: 'https://placehold.co/400x400',
    seller: 'ArtFromBits',
  },
  {
    id: 'p6',
    name: 'Assorted Capacitor Pack (100pcs)',
    price: 12.0,
    imageUrl: 'https://placehold.co/400x400',
    seller: 'ComponentCavern',
  },
];

export type EcoBurnUnit = {
  id: string;
  name: string;
  location: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  emissions: {
    co2: number;
    nox: number;
  };
};

export const ecoBurnUnits: EcoBurnUnit[] = [
  {
    id: 'eb1',
    name: 'Nairobi Eco-One',
    location: 'Industrial Area, Nairobi, Kenya',
    status: 'Online',
    emissions: { co2: 2.5, nox: 0.1 },
  },
  {
    id: 'eb2',
    name: 'Lagos Energy Hub',
    location: 'Ikeja, Lagos, Nigeria',
    status: 'Online',
    emissions: { co2: 3.1, nox: 0.2 },
  },
  {
    id: 'eb3',
    name: 'Cape Town Waste-to-Energy',
    location: 'Atlantis SEZ, Cape Town, South Africa',
    status: 'Maintenance',
    emissions: { co2: 0, nox: 0 },
  },
  {
    id: 'eb4',
    name: 'Accra Green Power',
    location: 'Tema, Accra, Ghana',
    status: 'Offline',
    emissions: { co2: 0, nox: 0 },
  },
];
