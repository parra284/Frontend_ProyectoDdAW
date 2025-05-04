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
          value: /^[a-zA-Z0-9._-]+@unisabana\.edu\.co/,
          message: 'Please enter a valid email address'
        }
      }  
    },
    {
      name: "id",
      validation: {
        pattern: {
          value: /^0000\d{6}$/,
          message: 'Use a valid ID'
        }
      }
    },
    {
      name: "password",
      validation: {
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters long'
        },
        maxLength: {
          value: 20,
          message: 'Password must be no longer than 20 characters'
        }
      }
    }
  ]

  const filteredFields = isSignup ? 
    fields : 
    fields.filter(field => field.name !== "name" && field.name !== "lastName" && field.name !== "id");

  return (
  <form 
    className='flex flex-col items-center justify-around min-h-screen'
    onSubmit={handleSubmit(onSubmit)}
  >
    <h2 className='text-dark-blue text-3xl font-bold'>{type}</h2>
    {filteredFields.map((field) => (
      <Input
      {...register(field.name, 
        {
          required: "This field is required",
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
