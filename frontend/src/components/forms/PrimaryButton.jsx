function PrimaryButton({
  children,
  type = "button",
  onClick,
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        w-full
        rounded-lg
        bg-green-600
        px-4
        py-3
        font-semibold
        text-white
        transition-all
        duration-200
        hover:bg-green-700
        disabled:cursor-not-allowed
        disabled:bg-gray-400
      "
    >
      {children}
    </button>
  );
}

export default PrimaryButton;