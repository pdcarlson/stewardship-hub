// /src/components/ui/Card.jsx
// a simple, reusable card component for consistent styling.
const Card = ({ title, children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default Card;