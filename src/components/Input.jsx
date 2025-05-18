const Input = ({ 
  name, 
  label, 
  value, 
  onChange, 
  error, 
  required = false, 
  type,
  variant = "primary" // primary, secondary, tertiary
}) => {
  const errorId = `${name}-error`;
  
  // Map variant to color properties
  const variantStyles = {
    primary: {
      focusRing: 'focus:ring-primary focus:border-primary',
      labelColor: 'text-primary',
    },
    secondary: {
      focusRing: 'focus:ring-secondary focus:border-secondary',
      labelColor: 'text-secondary',
    },
    tertiary: {
      focusRing: 'focus:ring-tertiary focus:border-tertiary',
      labelColor: 'text-tertiary',
    }
  };

  const { focusRing, labelColor } = variantStyles[variant] || variantStyles.primary;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className={`block mb-2 text-sm font-ginora font-medium ${labelColor}`}
        >
          {label}
          {required && <span className="text-secondary ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        className={`bg-white p-3 sm:p-2.5 rounded-md w-full border ${
          error 
            ? 'border-secondary focus:ring-secondary/30 focus:border-secondary' 
            : `border-gray-300 ${focusRing}/70`
        } focus:ring-2 outline-none text-base sm:text-base font-ginora`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        type={type || "text"}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        required={required}
      />
      {error && (
        <p
          className="text-secondary text-xs sm:text-sm mt-1 font-ginora"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;