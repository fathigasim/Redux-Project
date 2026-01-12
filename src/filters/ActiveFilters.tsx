// components/filters/ActiveFilters.tsx
import { Badge, Button } from "react-bootstrap";

interface ActiveFiltersProps {
  filters: Record<string, string>;
  onClear: (key: string) => void;
  labels?: Record<string, string>;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onClear,
  labels = {},
}) => {
  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => value && key !== "page"
  );

  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-3">
      <small className="text-muted me-2">Active filters:</small>
      {activeFilters.map(([key, value]) => (
        <Badge 
          key={key} 
          bg="secondary" 
          className="me-2"
          style={{ cursor: "pointer" }}
        >
          {labels[key] || key}: {value}
          <Button
            variant="link"
            size="sm"
            className="text-white p-0 ms-2"
            onClick={() => onClear(key)}
            style={{ textDecoration: "none" }}
          >
            ✕
          </Button>
        </Badge>
      ))}
    </div>
  );
};