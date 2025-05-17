const Input = ({ name, label, value, onChange, error, required = false, type }) => {
  const errorId = `${name}-error`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        className={`bg-input p-3 sm:p-2.5 rounded-lg w-full border ${error ? 'border-red-500 focus:ring-red-300 focus:border-red-300' : 'border-gray-300 focus:ring-blue-300 focus:border-blue-300'} focus:ring-2 outline-none text-base sm:text-base`}
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
          className="text-red-500 text-xs sm:text-sm mt-1"
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