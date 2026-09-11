import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

/**
 * Reusable AuthInput component for modern dark theme
 */
const AuthInput = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon: Icon,
  disabled = false,
  autoComplete,
  required = false,
  rightElement,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="block text-xs font-medium text-slate-300 tracking-wide"
          >
            {label}
            {required && <span className="text-emerald-400 ml-0.5">*</span>}
          </label>
          {rightElement}
        </div>
      )}

      <div className="relative rounded-xl group transition-all duration-200">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl bg-[#0D131B]/90 text-slate-100 placeholder:text-slate-500 text-sm transition-all duration-200 outline-none
            ${Icon ? "pl-10" : "pl-3.5"}
            ${isPassword ? "pr-11" : "pr-3.5"}
            py-3
            border
            ${
              error
                ? "border-rose-500/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
                : "border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="text-xs text-rose-400 flex items-center gap-1 mt-1 animate-fadeIn"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default AuthInput;

