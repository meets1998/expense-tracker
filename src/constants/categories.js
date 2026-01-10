import { 
  FiShoppingBag, 
  FiCoffee, 
  FiHome, 
  FiTruck,
  FiHeart,
  FiFilm,
  FiBook,
  FiGift,
  FiZap,
  FiMoreHorizontal
} from 'react-icons/fi';

export const CATEGORIES = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: FiCoffee,
    color: '#f59e0b',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: FiShoppingBag,
    color: '#ec4899',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: FiTruck,
    color: '#3b82f6',
  },
  {
    id: 'housing',
    name: 'Housing & Rent',
    icon: FiHome,
    color: '#8b5cf6',
  },
  {
    id: 'health',
    name: 'Health & Medical',
    icon: FiHeart,
    color: '#ef4444',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: FiFilm,
    color: '#06b6d4',
  },
  {
    id: 'education',
    name: 'Education',
    icon: FiBook,
    color: '#10b981',
  },
  {
    id: 'gifts',
    name: 'Gifts & Donations',
    icon: FiGift,
    color: '#f43f5e',
  },
  {
    id: 'utilities',
    name: 'Utilities & Bills',
    icon: FiZap,
    color: '#eab308',
  },
  {
    id: 'other',
    name: 'Other',
    icon: FiMoreHorizontal,
    color: '#71717a',
  },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};