import { useForm } from 'react-hook-form';
import Input from '../components/Input';
import Button from '../components/Button';
import transformText from '../utils/transformText';

export default function AuthForm({ onSubmit, type, fields, message, link }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div
      className={'flex flex-col items-center justify-around min-h-screen bg-cover bg-center'}
    >
      <form
        className='flex flex-col items-center justify-around w-full max-w-md p-4 bg-white bg-opacity-90 rounded-lg shadow-md'
        onSubmit={handleSubmit(onSubmit)}
        aria-labelledby="form-title"
      >
        <h2 id="form-title" className='text-dark-blue text-3xl font-bold'>{type}</h2>
        {fields.map((field) => (
          <Input
            key={field.name}
            {...register(field.name,
              {
                ...(field.name !== "lastName" && { required: "This field is required" }),
                ...field.validation
              }
            )}
            error={errors[field.name]?.message}
            aria-invalid={!!errors[field.name]}
            aria-describedby={`${field.name}-error`}
          />
        ))}

        <Button type="submit" label={type} />

        <p className="flex items-center space-x-2">
          <span>{message}</span>
          <a
            href={`/${link}`}
            className="text-blue-500 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {transformText(link)}
          </a>
        </p>
      </form>
    </div>
  );
}
