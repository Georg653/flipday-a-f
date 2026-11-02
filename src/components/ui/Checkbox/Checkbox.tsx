// src/components/ui/Checkbox/Checkbox.tsx
import React from 'react';
import './Checkbox.css'; // Создай Checkbox.css

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  label?: string; // Если лейбл нужен рядом
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange, disabled, className = '', ...props }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className={`checkbox-wrapper ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={!!checked} // Убедимся, что это boolean
        onChange={handleChange}
        disabled={disabled}
        className="checkbox-input"
        {...props}
      />
      {label && <label htmlFor={id} className="checkbox-label">{label}</label>}
    </div>
  );
};