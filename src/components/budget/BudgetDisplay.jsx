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

const BudgetDisplay = ({ metrics, totalBudget }) => {
  if (!metrics) return null;

  const isOverProjected = metrics.projectedSpending > totalBudget;

  return (
    <Card title="Semester Budget Overview">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Metric label="Total Budget" value={totalBudget} />
        <Metric label="Spent" value={metrics.totalSpent} colorClass="text-yellow-600" />
        <Metric label="Remaining" value={metrics.remaining} colorClass="text-green-600" />
        <Metric 
          label="Projected Spending" 
          value={metrics.projectedSpending} 
          colorClass={isOverProjected ? 'text-red-600' : 'text-blue-600'}
        />
      </div>
    </Card>
  );
};

export default BudgetDisplay;