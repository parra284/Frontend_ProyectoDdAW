import React from 'react';

const transformPlaceholder = (name) => {
  let transformed = name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/, ' $1');
  return transformed;
};

const Input = React.forwardRef(({ 
  error, 
  label, 
  id, 
  required = false,
  ...props 
}, ref) => {
  const { name } = props;
  const inputId = id || name;
  const errorId = `${inputId}-error`;
  const placeholder = transformPlaceholder(name);
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <input 
        className={`bg-input p-2 sm:p-2.5 rounded-lg w-full border ${error ? 'border-red-500 focus:ring-red-300 focus:border-red-300' : 'border-gray-300 focus:ring-blue-300 focus:border-blue-300'} focus:ring-2 outline-none text-sm sm:text-base`}
        ref={ref} 
        id={inputId}
        {...props}
        placeholder={props.placeholder || placeholder}
        type={name === "password" ? "password" : (props.type || "text")}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        required={required}
      />
      {error && (
        <p 
          className="text-red-500 text-xs sm:text-sm mt-1" 
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;