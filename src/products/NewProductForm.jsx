import { useForm } from "react-hook-form";
import Input from '../components/Input';
import Button from "../components/Button";

export default function NewProductForm({ type, onSubmit, fields, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues, // Set default values for the form fields
  });

  return (
    <form
      className='flex flex-col items-center justify-around w-full max-w-md p-4 bg-white bg-opacity-90 rounded-lg shadow-md'
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby="form-title"
    >
      <h2 id="form-title" className='text-dark-blue text-3xl font-bold'>{type}</h2>
      {fields.map((field) => (
        <Input
          key={field.name}
          {...register(field.name, field.validation)}
          error={errors[field.name]?.message}
        />
      ))}

      <Button type="submit" label={type} />
    </form>
  );
}