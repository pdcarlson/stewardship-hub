// /src/components/budget/ShoppingList.jsx
import Card from '../ui/Card';
import Button from '../ui/Button';

const ShoppingList = ({ items, onRemove }) => {
  if (items.length === 0) {
    return (
      <Card title="Shopping List">
        <p className="text-gray-500">No items have been reported out of stock. Great job!</p>
      </Card>
    );
  }

  return (
    <Card title="Shopping List">
      <ul className="space-y-3">
        {items.map(item => (
          <li key={item.$id} className="flex flex-wrap gap-4 justify-between items-center p-3 bg-gray-50 rounded-md">
            <span className="font-medium text-gray-800">{item.itemName}</span>
            <Button 
              variant="secondary" 
              onClick={() => onRemove(item.$id)}
              className="text-xs px-3 py-1 flex-shrink-0"
            >
              Mark as Purchased
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default ShoppingList;