// src/components/ui/Input/Input.tsx
import * as React from "react";
import "./Input.css"; // Убедись, что этот файл существует

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`input-base ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";