import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  const inputClasses = `w-full px-3 py-2 border border-border rounded-md bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`;

  const input = <input className={inputClasses} {...props} />;

  if (label) {
    return (
      <div>
        <label className="block text-sm font-medium text-text mb-1">
          {label}
        </label>
        {input}
      </div>
    );
  }

  return input;
}
