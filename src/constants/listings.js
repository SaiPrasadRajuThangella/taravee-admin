export const LISTING_CATEGORIES = [
  'Bridal Lehenga',
  'Designer Saree',
  'Sharara Set',
  'Salwar Suit',
  'Western Wear',
  'Indo-Western',
  'Luxury Accessory',
  'Other',
];

export const LISTING_CONDITIONS = [
  'Never worn (with tags)',
  'Worn once',
  'Worn twice',
  'Worn 3-5 times',
  'Worn more than 5 times',
];

export const LISTING_STATUS_STYLES = {
  draft: { bg: 'rgba(113, 113, 122, 0.2)', color: '#D4D4D8' },
  live: { bg: 'rgba(34, 197, 94, 0.15)', color: '#86EFAC' },
  sold: { bg: 'rgba(201, 168, 76, 0.2)', color: '#C9A84C' },
  hidden: { bg: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5' },
};

export const EMPTY_LISTING_FORM = {
  title: '',
  designer: '',
  category: '',
  fabricType: '',
  primaryColour: '',
  secondaryColour: '',
  condition: 'Worn once',
  size: '',
  description: '',
  internalPrice: '',
  internalNotes: '',
  status: 'draft',
  featured: false,
};
