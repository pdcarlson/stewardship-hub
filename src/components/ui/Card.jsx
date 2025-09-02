// /src/components/ui/Card.jsx
// a simple, reusable card component for consistent styling.
const Card = ({ title, children, className, headerContent }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {headerContent && <div>{headerContent}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Card;