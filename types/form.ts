export interface FieldProps {
  name: string;
  label: string;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ComboboxFieldProps extends FieldProps {
  options: string[];
}

export interface SelectFieldProps extends FieldProps {
  options: SelectOption[];
}

export interface CompensationPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}