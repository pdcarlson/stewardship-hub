// /src/components/budget/BudgetDisplay.jsx
// this component displays the key budget metrics.
import Card from '../ui/Card';

// eye icon for the toggle button
const EyeIcon = ({ closed }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {closed ? (
      <path strokeLineCap="round" strokeLineJoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    ) : (
      <>
        <path strokeLineCap="round" strokeLineJoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLineCap="round" strokeLineJoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
      </>
    )}
  </svg>
);


const Metric = ({ label, value, colorClass = 'text-gray-900', isVisible }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-3xl font-bold ${colorClass}`}>
      {/* conditionally render value or asterisks */}
      {isVisible ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '******'}
    </p>
  </div>
);

const BudgetDisplay = ({ metrics, isBudgetVisible, onToggleVisibility }) => {
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
  
  // button to pass to the card header
  const toggleButton = (
    <button onClick={onToggleVisibility} className="text-gray-400 hover:text-gray-600">
      <EyeIcon closed={!isBudgetVisible} />
    </button>
  );

  return (
    <Card title="Semester Budget Overview" headerContent={toggleButton}>
      {/* updated grid classes for responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
        <Metric label="Total Budget" value={metrics.totalBudget} isVisible={isBudgetVisible} />
        <Metric label="Spent" value={metrics.totalSpent} colorClass="text-yellow-600" isVisible={isBudgetVisible} />
        <Metric label="Remaining" value={metrics.remaining} colorClass="text-green-600" isVisible={isBudgetVisible} />
        <Metric 
          label="Projected Spending" 
          value={metrics.projectedSpending} 
          colorClass={isOverProjected ? 'text-red-600' : 'text-blue-600'}
          isVisible={isBudgetVisible}
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