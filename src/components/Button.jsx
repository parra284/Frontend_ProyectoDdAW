export default function Button({ 
  type = "button", 
  label, 
  className = "", 
  variant = "primary", // primary, secondary, tertiary
  disabled = false, 
  onClick 
}) {
  // Map variant to color properties
  const variantStyles = {
    primary: {
      bgColor: 'bg-primary',
      textColor: 'text-white',
      borderColor: 'border-primary',
      hoverBg: 'hover:bg-white',
      hoverText: 'hover:text-primary',
      hoverBorder: 'hover:border-primary'
    },
    secondary: {
      bgColor: 'bg-secondary',
      textColor: 'text-white',
      borderColor: 'border-secondary',
      hoverBg: 'hover:bg-white',
      hoverText: 'hover:text-secondary',
      hoverBorder: 'hover:border-secondary'
    },
    tertiary: {
      bgColor: 'bg-tertiary',
      textColor: 'text-primary',
      borderColor: 'border-tertiary',
      hoverBg: 'hover:bg-white',
      hoverText: 'hover:text-tertiary',
      hoverBorder: 'hover:border-tertiary'
    }
  };

  const { bgColor, textColor, borderColor, hoverBg, hoverText, hoverBorder } = variantStyles[variant] || variantStyles.primary;

  return (
    <button 
      className={`${bgColor} p-3 sm:p-2.5 rounded-lg w-full text-base sm:text-base
      ${textColor} border-2 ${borderColor}
      font-ginora font-medium transition-colors duration-200
      ${hoverBg} ${hoverText} ${hoverBorder}
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}
      ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};