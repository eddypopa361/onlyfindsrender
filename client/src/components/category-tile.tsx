import { iconByCategory, iconBySubcategory } from "./category-icons";

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
  const Icon = isSubcategory ? iconBySubcategory[label] : iconByCategory[label];
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-300 ${
        isActive
          ? "border-primary/50 bg-primary/20 shadow-lg shadow-primary/20"
          : "border-gray-800 bg-gray-950 hover:border-primary/30 hover:bg-gray-900"
      }`}
    >
      {Icon && (
        <Icon 
          className={`h-6 w-6 ${
            isActive ? "text-primary" : "text-primary/70"
          }`} 
          aria-hidden="true" 
        />
      )}
      <span className={`text-sm font-medium text-center ${
        isActive ? "text-white" : "text-gray-300"
      }`}>
        {label}
      </span>
    </button>
  );
}