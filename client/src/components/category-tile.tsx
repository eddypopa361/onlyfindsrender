import { imageByCategory, imageBySubcategory } from "./category-icons";

interface CategoryTileProps {
  label: string;
  isSubcategory?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryTile({ 
  label, 
  isSubcategory = false, 
  isActive = false, 
  onClick 
}: CategoryTileProps) {
  const imageUrl = isSubcategory ? imageBySubcategory[label] : imageByCategory[label];
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-6 transition-all duration-300 min-h-[120px] ${
        isActive
          ? "border-primary/50 bg-primary/20 shadow-lg shadow-primary/20"
          : "border-gray-800 bg-gray-950 hover:border-primary/30 hover:bg-gray-900"
      }`}
    >
      {imageUrl && (
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={imageUrl}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <span className={`text-sm font-medium text-center leading-tight ${
        isActive ? "text-white" : "text-gray-300"
      }`}>
        {label}
      </span>
    </button>
  );
}