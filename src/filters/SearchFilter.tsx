// components/filters/SearchFilter.tsx
import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface SearchFilterProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  value,
  onSearch,
  placeholder = "Search...",
  debounceMs = 500,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [debouncedValue] = useDebounce(localValue, debounceMs);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== value) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <Form.Control
      type="text"
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      aria-label="Search"
    />
  );
};