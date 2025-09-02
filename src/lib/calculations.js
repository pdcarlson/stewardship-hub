// /src/lib/calculations.js

/**
 * calculates the total budget from its constituent parts.
 * @param {object} config - the semester configuration object.
 * @returns {number} the calculated total budget.
 */
export function calculateTotalBudget(config) {
  if (!config) return 0;
  const mealPlanRevenue = (config.brothersOnMealPlan || 0) * (config.mealPlanCost || 0);
  return mealPlanRevenue + (config.carryoverBalance || 0) + (config.additionalRevenue || 0);
}

/**
 * calculates average weekly usage and cost for recurring items.
 * @param {Array<Object>} purchases - all purchase documents.
 * @param {object} config - the semester configuration object.
 * @returns {Object} an object mapping item names to their usage stats.
 */
export function calculateAverageWeeklyUsage(purchases, config) {
  // fix: process all recurring purchases, not just active ones
  const recurringPurchases = purchases.filter(p => p.purchaseFrequency && p.purchaseFrequency !== 'once');
  
  if (recurringPurchases.length === 0 || !config) {
    return {};
  }

  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  const today = new Date();
  
  const effectiveEndDate = today > endDate ? endDate : today;

  let weeksPassed = (effectiveEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
  if (weeksPassed <= 0) {
    weeksPassed = 1; 
  }

  const itemsByName = recurringPurchases.reduce((acc, p) => {
    const itemName = p.itemName.toLowerCase();
    if (!acc[itemName]) {
      acc[itemName] = [];
    }
    acc[itemName].push(p);
    return acc;
  }, {});

  const usageStats = {};
  for (const itemName in itemsByName) {
    const itemPurchases = itemsByName[itemName];
    const totalQuantity = itemPurchases.reduce((sum, p) => sum + p.quantity, 0);
    const totalCost = itemPurchases.reduce((sum, p) => sum + p.cost, 0);
    
    usageStats[itemName] = {
      itemName: itemPurchases[0].itemName,
      avgWeeklyCount: parseFloat((totalQuantity / weeksPassed).toFixed(2)),
      avgCost: parseFloat((totalCost / totalQuantity).toFixed(2)),
      // determine status from the first item (all should be the same)
      isActive: itemPurchases[0].isActiveForProjection,
    };
  }

  return usageStats;
}


/**
 * calculates key budget metrics using the new average usage projection.
 * @param {object} config - the semester configuration object.
 * @param {Array<Object>} purchases - an array of purchase objects.
 * @param {Object} usageStats - the pre-calculated weekly usage statistics.
 * @returns {{totalBudget: number, totalSpent: number, remaining: number, projectedSpending: number}} an object with budget metrics.
 */
export function calculateBudgetMetrics(config, purchases, usageStats) {
  const totalBudget = calculateTotalBudget(config);
  const totalSpent = purchases.reduce((acc, p) => acc + p.cost, 0);

  const today = new Date();
  const endDate = new Date(config.endDate);
  const remainingDays = Math.max(0, (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const remainingWeeks = remainingDays / 7;

  let projectedFutureSpending = 0;
  for (const itemName in usageStats) {
    const stats = usageStats[itemName];
    // only project future spending for items that are active
    if (stats.isActive) {
      projectedFutureSpending += stats.avgWeeklyCount * stats.avgCost * remainingWeeks;
    }
  }
  
  const oneTimeCosts = purchases
    .filter(p => p.purchaseFrequency === 'once')
    .reduce((sum, p) => sum + p.cost, 0);

  const recurringSpent = totalSpent - oneTimeCosts;
  const projectedSpending = recurringSpent + projectedFutureSpending + oneTimeCosts;

  return {
    totalBudget: parseFloat(totalBudget.toFixed(2)),
    totalSpent: parseFloat(totalSpent.toFixed(2)),
    remaining: parseFloat((totalBudget - totalSpent).toFixed(2)),
    projectedSpending: parseFloat(projectedSpending.toFixed(2)),
  };
}