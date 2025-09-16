// /src/lib/dummyData.js
// this file contains hardcoded data for the public-facing demo.
import { calculateBudgetMetrics, calculateAverageWeeklyUsage } from './calculations';

// --- base data ---

export const dummyConfig = {
  $id: 'dummyconfig',
  semesterName: 'Fall 2025',
  startDate: '2025-09-01T12:00:00.000Z',
  endDate: '2025-12-15T12:00:00.000Z',
  brothersOnMealPlan: 40,
  mealPlanCost: 500,
  carryoverBalance: 1500,
  additionalRevenue: 500,
};

export const dummyPurchases = [
  // generate some purchases for the last few weeks
  ...Array.from({ length: 5 }).map((_, i) => ({
    $id: `milk${i}`,
    itemName: 'Milk',
    cost: 24.99,
    quantity: 6,
    purchaseDate: new Date(new Date().setDate(new Date().getDate() - (i * 7) - 2)).toISOString(),
    category: 'Meal Plan',
    purchaseFrequency: 'recurring',
    isActiveForProjection: true,
    isStockItem: true,
  })),
  ...Array.from({ length: 5 }).map((_, i) => ({
    $id: `bread${i}`,
    itemName: 'Bread',
    cost: 15.49,
    quantity: 5,
    purchaseDate: new Date(new Date().setDate(new Date().getDate() - (i * 7) - 3)).toISOString(),
    category: 'Meal Plan',
    purchaseFrequency: 'recurring',
    isActiveForProjection: true,
    isStockItem: true,
  })),
  ...Array.from({ length: 2 }).map((_, i) => ({
    $id: `eggs${i}`,
    itemName: 'Eggs (5 dozen)',
    cost: 45.00,
    quantity: 1,
    purchaseDate: new Date(new Date().setDate(new Date().getDate() - (i * 14) - 5)).toISOString(),
    category: 'Meal Plan',
    purchaseFrequency: 'recurring',
    isActiveForProjection: true,
    isStockItem: true,
  })),
  {
    $id: 'pizza1',
    itemName: 'Pizza for Brotherhood Event',
    cost: 250.00,
    quantity: 1,
    purchaseDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    category: 'Social',
    purchaseFrequency: 'once',
    isActiveForProjection: false,
    isStockItem: false,
  },
  {
    $id: 'cereal1',
    itemName: 'Cereal Variety Pack',
    cost: 35.75,
    quantity: 3,
    purchaseDate: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
    category: 'Meal Plan',
    purchaseFrequency: 'recurring',
    isActiveForProjection: false, // example of an inactive item
    isStockItem: true,
  },
];

export const dummyShoppingList = [
  { $id: 'shop1', itemName: 'Seltzer Water', reportedBy: 'dummyUser' },
  { $id: 'shop2', itemName: 'Paper Towels', reportedBy: 'dummyUser' },
];

export const dummySuggestions = [
  { $id: 'sug1', itemName: 'Steaks for Grill Night', reason: 'Would be great for brotherhood morale.', submittedBy: 'dummyUser', status: 'Pending' },
  { $id: 'sug2', itemName: 'More Coffee Options', reason: 'We only have one kind.', submittedBy: 'dummyUser', status: 'Approved', adminResponse: 'Good idea, added to the list.' },
  { $id: 'sug3', itemName: 'Energy Drinks', reason: '', submittedBy: 'dummyUser', status: 'Declined', adminResponse: 'Not in the budget for this semester.' },
];

export const dummyRequests = [
  { $id: 'req1', userId: 'dummyUser1', userName: 'John Doe', email: 'john.doe@example.com', status: 'pending' },
  { $id: 'req2', userId: 'dummyUser2', userName: 'Jane Smith', email: 'jane.smith@example.com', status: 'pending' },
];

// --- derived data ---

// pre-calculate metrics and usage so the demo is fast
export const dummyUsageStats = calculateAverageWeeklyUsage(dummyPurchases, dummyConfig);
export const dummyMetrics = calculateBudgetMetrics(dummyConfig, dummyPurchases, dummyUsageStats);

// --- dummy handlers ---
// these functions do nothing but log to the console, making the demo ui feel interactive.
export const dummyHandler = (action, data) => {
  console.log(`[DEMO] Action: ${action}`, data || '');
  // for optimistic ui, we might show a toast notification here
};