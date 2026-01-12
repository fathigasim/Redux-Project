// components/filters/SelectFilter.tsx
import { Form } from "react-bootstrap";

interface Option {
  value: string;
  label: string;
}

interface SelectFilterProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  allowEmpty?: boolean;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
  value,
  options,
  onChange,
  placeholder = "Select...",
  allowEmpty = true,
}) => {
  return (
    <Form.Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder}
    >
      {allowEmpty && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
};