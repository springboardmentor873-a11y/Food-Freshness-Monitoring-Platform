import { useState } from "react";

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  name,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>
    </div>
  );
}

export default PasswordField;