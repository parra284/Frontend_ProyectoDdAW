import { useForm } from 'react-hook-form';
import Input from '../components/Input';
import Button from '../components/Button';
import { useState } from 'react';

export default function AuthForm({ onSubmit, type }) {
  const { register, handleSubmit, formState: {errors}} = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isSignup = type === "Sign Up";

  const onlyLetters = {
    value: /^[A-Za-z]+$/,
    message: 'This field can only contain letters'
  }

  const fields = [
    {
      name: "name",
      validation: {
        pattern: onlyLetters
      }
    },
    {
      name: "lastName",
      validation: {
        pattern: onlyLetters
      }
    },
    {
      name: "email",
      validation: {
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Please enter a valid email address'
        }
      }  
    },
    {
      name: "password",
      validation: {
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters long'
        }
      }
    }
  ]
    
  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    await onSubmit(data);
    setIsLoading(false);
  };

  const filteredFields = isSignup ? 
    fields : 
    fields.filter(field => field.name !== "name" && field.name !== "lastName");

  const renderFields = () => 
    filteredFields.map((field) => (
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
    <h2 className='text-dark-blue text-3xl font-bold'>{type}</h2>
    {renderFields()}

    <Button type="submit" label={isLoading ? "Loading..." : type} disabled={isLoading} />

    <p className="flex items-center space-x-2">
      <span>{isSignup ? "Already have an account?" : "Don't have an account?"}</span>
      <a 
        href={isSignup ? "/login" : "/signup"} 
        className="text-blue-500 underline"
      >
        {isSignup ? "Log in" : "Sign Up"}
      </a>
    </p>
  </form>
  );
}
