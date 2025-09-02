// /src/components/budget/BudgetDisplay.jsx
// this component displays the key budget metrics.
import Card from '../ui/Card';

const Metric = ({ label, value, colorClass = 'text-gray-900' }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-3xl font-bold ${colorClass}`}>
      {/* formats number as usd currency */}
      {value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
    </p>
  </div>
);

const BudgetDisplay = ({ metrics }) => {
  if (!metrics) return null;

  const isOverProjected = metrics.projectedSpending > metrics.totalBudget;

  const spentPercentage = (metrics.totalSpent / metrics.totalBudget) * 100;
  const projectedPercentage = (metrics.projectedSpending / metrics.totalBudget) * 100;

  let progressBarColor = 'bg-blue-600';
  if (projectedPercentage > 100) {
    progressBarColor = 'bg-red-600';
  } else if (projectedPercentage > 90) {
    progressBarColor = 'bg-yellow-500';
  }

  return (
    <Card title="Semester Budget Overview">
      {/* updated grid classes for responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
        <Metric label="Total Budget" value={metrics.totalBudget} />
        <Metric label="Spent" value={metrics.totalSpent} colorClass="text-yellow-600" />
        <Metric label="Remaining" value={metrics.remaining} colorClass="text-green-600" />
        <Metric 
          label="Projected Spending" 
          value={metrics.projectedSpending} 
          colorClass={isOverProjected ? 'text-red-600' : 'text-blue-600'}
        />
      </div>

      <div className="mt-6">
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full rounded-full ${progressBarColor}`}
            style={{ width: `${spentPercentage}%` }}
          ></div>
          <div
            className="absolute top-0 h-full w-1 bg-gray-800"
            style={{ left: `${projectedPercentage}%` }}
            title={`Projected: ${projectedPercentage.toFixed(1)}%`}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>{`Spent: ${spentPercentage.toFixed(1)}%`}</span>
          <span>{`Projected: ${projectedPercentage.toFixed(1)}%`}</span>
        </div>
      </div>
    </Card>
  );
};

export default BudgetDisplay;