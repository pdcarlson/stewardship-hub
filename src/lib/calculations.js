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
 * calculates key budget metrics based on total budget, time frame, and spending history.
 * @param {object} config - the semester configuration object.
 * @param {Array<Object>} purchases - an array of purchase objects.
 * @returns {{totalBudget: number, totalSpent: number, remaining: number, projectedSpending: number}} an object with budget metrics.
 */
export function calculateBudgetMetrics(config, purchases) {
  const totalBudget = calculateTotalBudget(config);
  const { startDate: startDateStr, endDate: endDateStr } = config;

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // prevent errors from invalid date strings
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("invalid start or end date provided.");
    return { totalBudget, totalSpent: 0, remaining: totalBudget, projectedSpending: 0 };
  }

  // calculate total duration of the budget period in days/weeks
  const totalSemesterDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const totalSemesterWeeks = totalSemesterDays / 7;

  if (totalSemesterDays <= 0) {
    return { totalBudget, totalSpent: 0, remaining: totalBudget, projectedSpending: 0 };
  }
  
  // calculate total spent by summing up all purchase costs
  const totalSpent = purchases.reduce((acc, p) => acc + p.cost, 0);
  
  // --- new projection logic ---
  let projectedSpending = 0;
  const oneTimePurchases = purchases.filter(p => p.purchaseFrequency === 'once');
  const recurringPurchases = purchases.filter(p => p.purchaseFrequency !== 'once');

  // 1. add all one-time costs to the projection
  projectedSpending += oneTimePurchases.reduce((acc, p) => acc + p.cost, 0);

  // 2. calculate and add projected costs for recurring items
  recurringPurchases.forEach(p => {
    let multiplier = 0;
    switch (p.purchaseFrequency) {
      case 'weekly':
        multiplier = totalSemesterWeeks;
        break;
      case 'bi-weekly':
        multiplier = totalSemesterWeeks / 2;
        break;
      case 'monthly':
        multiplier = totalSemesterWeeks / 4.33; // average weeks in a month
        break;
      default:
        multiplier = 0;
    }
    projectedSpending += p.cost * multiplier;
  });


  return {
    totalBudget: parseFloat(totalBudget.toFixed(2)),
    totalSpent: parseFloat(totalSpent.toFixed(2)),
    remaining: parseFloat((totalBudget - totalSpent).toFixed(2)),
    projectedSpending: parseFloat(projectedSpending.toFixed(2)),
  };
}


/**
 * calculates the average weekly consumption of an item based on its consumption logs.
 * @param {Array<{quantityUsed: number, logDate: string}>} logs - array of consumption log objects.
 * @returns {number} the average number of units consumed per week.
 */
export function calculateWeeklyConsumption(logs) {
    if (!logs || logs.length < 2) return 0;

    // ensure logs are sorted by date to find the correct time span
    logs.sort((a, b) => new Date(a.logDate).getTime() - new Date(b.logDate).getTime());
    
    const firstDate = new Date(logs[0].logDate);
    const lastDate = new Date(logs[logs.length - 1].logDate);

    // calculate the total time span of logging in days
    const totalDays = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // avoid division by zero; if less than a day, treat as one day for calculation
    const totalWeeks = (totalDays > 1 ? totalDays : 1) / 7;
    
    const totalUsed = logs.reduce((sum, log) => sum + log.quantityUsed, 0);

    const average = totalUsed / totalWeeks;
    return parseFloat(average.toFixed(2));
}