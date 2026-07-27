function Input({
  label,
  ...props
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          transition-all
          duration-200
          outline-none

          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      />

    </div>
  );
}

export default Input;