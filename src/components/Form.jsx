import { useForm } from 'react-hook-form';
import Input from './Input';
import Button from './Button';

export default function Form({ onSubmit, type, fields, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
  });

  return (
      <form
        className='flex flex-col items-center justify-around p-4'
        onSubmit={handleSubmit(onSubmit)}
        aria-labelledby="form-title"
      >
        <h2 id="form-title" className='text-dark-blue text-3xl font-bold'>{type}</h2>
        {fields.map((field) => (
          <Input
            key={field.name}
            {...register(field.name, field.validation)}
            error={errors[field.name]?.message}
            aria-invalid={!!errors[field.name]}
            aria-describedby={`${field.name}-error`}
          />
        ))}

        <Button type="submit" label={type} />
      </form>
  );
}
