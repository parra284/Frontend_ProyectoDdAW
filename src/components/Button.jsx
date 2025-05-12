export default function Button({ 
  type = "button", 
  label, 
  className = "", 
  disabled = false,
  onClick,
  ariaLabel,
  id,
  ...props 
}) {
  return (
    <button 
      className={`bg-dark-blue p-2 sm:p-2.5 rounded-lg w-full text-white border-2 text-sm sm:text-base
      font-medium transition-colors duration-200 hover:bg-white hover:text-dark-blue 
      hover:border-dark-blue focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}
      ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel || label}
      id={id}
      {...props}
    >
      {label}
    </button>
  );
};