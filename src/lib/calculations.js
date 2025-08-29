// /src/lib/calculations.js

/**
 * calculates key budget metrics based on total budget, time frame, and spending history.
 * @param {number} totalBudget - the total budget for the semester.
 * @param {string} startDateStr - the iso 8601 date string for the semester start date.
 * @param {string} endDateStr - the iso 8601 date string for the semester end date.
 * @param {Array<Object>} purchases - an array of purchase objects, each must have a 'cost' property.
 * @returns {{totalSpent: number, remaining: number, projectedSpending: number}} an object with budget metrics.
 */
export function calculateBudgetMetrics(totalBudget, startDateStr, endDateStr, purchases) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const today = new Date();

  // prevent errors from invalid date strings
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("invalid start or end date provided.");
    return { totalSpent: 0, remaining: totalBudget, projectedSpending: 0 };
  }

  // calculate total duration of the budget period in days
  const totalSemesterDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (totalSemesterDays <= 0) {
    return { totalSpent: 0, remaining: totalBudget, projectedSpending: 0 };
  }
  
  // calculate how many days have passed since the start date
  let daysIntoSemester = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // clamp the value to be within the semester bounds
  if (daysIntoSemester < 0) daysIntoSemester = 0;
  if (daysIntoSemester > totalSemesterDays) daysIntoSemester = totalSemesterDays;

  // calculate total spent by summing up all purchase costs
  const totalSpent = purchases.reduce((acc, p) => acc + p.cost, 0);
  
  // determine average daily spending based on days passed
  const averageDailySpending = daysIntoSemester > 0 ? totalSpent / daysIntoSemester : 0;
  
  // project total spending over the entire semester
  const projectedSpending = averageDailySpending * totalSemesterDays;

  return {
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