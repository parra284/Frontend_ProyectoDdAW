import React from 'react';

const transformPlaceholder = (name) =>{
  let transformed = name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/, ' $1');
  return transformed
}

const Input = React.forwardRef(({ error, ...props }, ref) => {
  const { name } = props;

  return (
    <div>
      <input 
        className="bg-input p-2.5 rounded-lg w-100"
        ref={ref} 
        {...props}
        placeholder={transformPlaceholder(name)}
        type={name == "password" ? "password" : "text"}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
});

export default Input;