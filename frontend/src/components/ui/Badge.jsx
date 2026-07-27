function Badge({
  children,
  color = "green",
}) {
  const colors = {
    green:
      "bg-green-100 text-green-700",

    red:
      "bg-red-100 text-red-700",

    blue:
      "bg-blue-100 text-blue-700",

    orange:
      "bg-orange-100 text-orange-700",

    gray:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${colors[color]}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;