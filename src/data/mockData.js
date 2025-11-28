export const mockBurgers = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce',
    price: 750,
    category: 'classic',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop',
    dietary: ['gluten-free-option'],
    ingredients: ['beef', 'cheese', 'lettuce', 'tomato']
  },
  {
    id: '2',
    name: 'Bacon Deluxe',
    description: 'Double beef patties with crispy bacon, swiss cheese, and caramelized onions',
    price: 850,
    category: 'premium',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=500&fit=crop',
    dietary: [],
    ingredients: ['beef', 'bacon', 'cheese', 'onions']
  },
  {
    id: '3',
    name: 'Veggie Supreme',
    description: 'Plant-based patty with avocado, mushrooms, and vegan mayo',
    price: 650,
    category: 'veggie',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=500&fit=crop',
    dietary: ['vegetarian', 'vegan'],
    ingredients: ['plant-based', 'avocado', 'mushrooms']
  },
  {
    id: '4',
    name: 'Spicy Jalapeño',
    description: 'Beef patty with jalapeños, pepper jack cheese, and chipotle sauce',
    price: 700,
    category: 'spicy',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&h=500&fit=crop',
    dietary: [],
    ingredients: ['beef', 'jalapeños', 'pepper-jack', 'chipotle']
  },
  {
    id: '5',
    name: 'BBQ Ranch',
    description: 'Smoky BBQ sauce, crispy onion rings, bacon, and ranch dressing',
    price: 850,
    category: 'premium',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=500&fit=crop',
    dietary: [],
    ingredients: ['beef', 'bacon', 'bbq-sauce', 'onion-rings']
  },
  {
    id: '6',
    name: 'Mushroom Swiss',
    description: 'Sautéed mushrooms, swiss cheese, and garlic aioli',
    price: 700,
    category: 'classic',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
    dietary: [],
    ingredients: ['beef', 'mushrooms', 'swiss-cheese', 'aioli']
  }
];

export const mockOrders = [
  {
    id: 'ORD001',
    userId: '1',
    items: [{ burgerId: '1', quantity: 2, name: 'Classic Cheeseburger', price: 8.99 }],
    total: 17.98,
    status: 'delivered',
    createdAt: new Date('2025-10-25').toISOString(),
    deliveryAddress: '123 Main St, Apt 4B'
  }
];

export const mockChallenges = [
  {
    id: 'CH001',
    name: 'Burger Marathon',
    description: 'Order 5 different burgers this month',
    reward: 100,
    progress: 0,
    total: 5,
    expiresAt: '2025-11-30'
  },
  {
    id: 'CH002',
    name: 'Spice Master',
    description: 'Try all our spicy burgers',
    reward: 50,
    progress: 0,
    total: 3,
    expiresAt: '2025-11-30'
  },
  {
    id: 'CH003',
    name: 'Weekend Warrior',
    description: 'Order on 4 weekends in a row',
    reward: 75,
    progress: 0,
    total: 4,
    expiresAt: '2025-11-30'
  }
];

export const mockLeaderboard = [
  { rank: 1, name: 'BurgerKing23', points: 1250, badges: ['🏆', '🔥', '⭐'] },
  { rank: 2, name: 'FoodieFan', points: 1100, badges: ['🔥', '⭐'] },
  { rank: 3, name: 'HungryHippo', points: 980, badges: ['⭐'] },
  { rank: 4, name: 'MeatLover', points: 850, badges: ['🔥'] },
  { rank: 5, name: 'HealthyEater', points: 720, badges: [] }
];
