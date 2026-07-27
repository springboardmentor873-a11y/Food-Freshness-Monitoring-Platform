function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    secondary:
      "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700",
  };

  return (
    <button
      {...props}
      className={`
        rounded-xl
        px-5
        py-3
        font-semibold
        transition-all
        duration-300
        hover:scale-105
        active:scale-95
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;