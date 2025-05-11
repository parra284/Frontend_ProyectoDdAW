import React from 'react';
import transformText from '../utils/TransformText';

const Input = React.forwardRef(({ error, ...props }, ref) => {
  const { name } = props;

  return (
    <div>
      <input 
        className="bg-input p-2.5 rounded-lg w-100"
        ref={ref} 
        {...props}
        placeholder={transformText(name)}
        type={name == "password" ? "password" : "text"}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
});

export default Input;