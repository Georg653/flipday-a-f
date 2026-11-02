// src/components/ui/Button/Button.tsx
import * as React from "react";
import "./Button.css"; // Убедись, что этот файл существует

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "link" | "destructive" | "success"; // Добавил варианты
  size?: "default" | "sm" | "lg" | "icon";
  customVariant?: "save" | "cancel"; // Твой кастомный вариант
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", customVariant, ...props }, ref) => {
    const variantClass = {
      default: "button-default",
      outline: "button-outline",
      link: "button-link",
      destructive: "button-destructive", // Для кнопки "Delete"
      success: "button-success",     // Для кнопки "Save/Create"
    }[variant];

    const sizeClass = {
      default: "button-size-default",
      sm: "button-size-sm",
      lg: "button-size-lg",
      icon: "button-size-icon", // Для кнопок-иконок (например, редактировать/удалить в таблице)
    }[size];

    const customClass = customVariant === "save" ? "button-custom-save" : customVariant === "cancel" ? "button-custom-cancel" : "";

    return (
      <button
        ref={ref}
        className={`button-base ${variantClass} ${sizeClass} ${customClass} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";