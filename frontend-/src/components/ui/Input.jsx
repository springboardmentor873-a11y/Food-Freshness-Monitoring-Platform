import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Input — text/email/password/search input primitive.
 * Handles label, helper text, error state, left/right icon slots,
 * and a built-in password-reveal toggle when type="password".
 */
const Input = forwardRef(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      type = "text",
      id,
      className,
      containerClassName,
      required = false,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && <span className="ml-0.5 text-rose-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400",
              "transition-colors duration-150 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500",
              error
                ? "border-rose-400 focus:ring-rose-500/40 focus:border-rose-500"
                : "border-slate-200 dark:border-slate-700",
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              className
            )}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          ) : (
            rightIcon && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {rightIcon}
              </span>
            )
          )}
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-rose-500">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
