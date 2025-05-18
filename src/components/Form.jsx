import { useState } from 'react';
import Input from './Input';
import Button from './Button';

export default function Form({ type, onSubmit, fields }) {
  // State for form values and errors
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map(f => [f.name, ""]))
  );
  const [errors, setErrors] = useState({});

  // Validate fields
  const validate = () => {
    const newErrors = {};
    fields.forEach(field => {
      const value = values[field.name];
      if (field.required && !value) {
        newErrors[field.name] = "This field is required";
      } else if (field.pattern && value && !field.pattern.test(value)) {
        newErrors[field.name] = field.errorMsg;
      } else if (field.minLength && value.length < field.minLength) {
        newErrors[field.name] = field.errorMsg;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
    setErrors(e => ({ ...e, [name]: undefined }));
  };

  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  return (
    <form
      className="w-full flex flex-col items-center px-2 sm:px-0"
      onSubmit={handleFormSubmit}
      aria-labelledby="form-title"
    >
      <h2 id="form-title" className="text-primary text-2xl sm:text-3xl font-bebas mb-4 sm:mb-6 text-center">{type}</h2>
      <div className="w-full space-y-4">
        {fields.map(field => (
          <Input
            key={field.name}
            name={field.name}
            label={field.label}
            value={values[field.name]}
            onChange={handleChange}
            error={errors[field.name]}
            required={field.required}
            type={field.type}
          />
        ))}
      </div>
      <div className="w-full mt-6">
        <Button type="submit" label={type} />
      </div>
    </form>
  );

}