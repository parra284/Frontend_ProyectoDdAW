import { useForm } from 'react-hook-form';
import Input from '../components/Input';
import Button from '../components/Button';
import { useState } from 'react';
import transformText from '../utils/TransformText';

export default function AuthForm({ onSubmit, type, fields, message }) {
  const { register, handleSubmit, formState: {errors}} = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    await onSubmit(data);
    setIsLoading(false);
  };

  const renderFields = () => 
    fields.map((field) => (
      <Input
      key={field.name}
      {...register(field.name, 
        {
          ...(field.name !== "lastName" && {required: "This field is required"}),
          ...field.validation
        }
      )}
      error={errors[field.name]?.message}
      />
    ));

  return (
  <form 
    className='flex flex-col items-center justify-around min-h-screen'
    onSubmit={handleSubmit(handleFormSubmit)}
  >
    <h2 className='text-dark-blue text-3xl font-bold'>{transformText(type)}</h2>
    {renderFields()}

    <Button type="submit" label={isLoading ? "Loading..." : type} disabled={isLoading} />

    <p className="flex items-center space-x-2">
      <span>{message}</span>
      <a 
        href={`/${type}`} 
        className="text-blue-500 underline"
      >
        {transformText(type)}
      </a>
    </p>
  </form>
  );
}
