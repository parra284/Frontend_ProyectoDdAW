import { useForm } from 'react-hook-form';
import Input from '../components/Input';
import Button from '../components/Button';

export default function AuthForm({ onSubmit, type }) {
  const { register, handleSubmit, formState: {errors}} = useForm();

  const isSignup = type == "Sign Up";

  const onlyLetters = () => {
    return {
      value: /^[A-Za-z]+$/,
      message: 'This field can only contain letters'
    }
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

  const filteredFields = isSignup ? 
    fields : 
    fields.filter(field => field.name !== "name" && field.name !== "lastName");

  return (
  <form 
    className='flex flex-col items-center justify-around min-h-screen'
    onSubmit={handleSubmit(onSubmit)}
  >
    <h2 className='text-dark-blue text-3xl font-bold'>{type}</h2>
    {filteredFields.map((field) => (
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
    ))}

    <Button type="submit" label={type} />

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
