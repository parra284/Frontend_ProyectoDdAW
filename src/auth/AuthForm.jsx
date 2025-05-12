import { useForm } from 'react-hook-form';
import Input from '../components/Input';
import Button from '../components/Button';

export default function AuthForm({ onSubmit, type }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const isSignup = type === "Sign Up";

  const onlyLetters = () => {
    return {
      value: /^[A-Za-z]+$/,
      message: 'This field can only contain letters'
    };
  };

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
  ];

  const filteredFields = isSignup ?
    fields :
    fields.filter(field => field.name !== "name" && field.name !== "lastName");
  return (
    <div
      className={`flex flex-col items-center justify-around min-h-screen bg-cover bg-center ${isSignup ? 'bg-signup' : 'bg-login'}`}
    >
      <form
        className='flex flex-col items-center justify-around w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 bg-white bg-opacity-90 rounded-lg shadow-md mx-4'
        onSubmit={handleSubmit(onSubmit)}
        aria-labelledby="form-title"
      >
        <h2 id="form-title" className='text-dark-blue text-2xl sm:text-3xl font-bold mb-4 sm:mb-6'>{type}</h2>
        <div className="w-full space-y-4">
          {filteredFields.map((field) => (
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
        </div>

        <div className="w-full mt-6">
          <Button type="submit" label={type} />
        </div>

        <p className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-6">
          <span>{isSignup ? "Already have an account?" : "Don't have an account?"}</span>
          <a
            href={isSignup ? "/login" : "/signup"}
            className="text-blue-500 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {isSignup ? "Log in" : "Sign Up"}
          </a>
        </p>
      </form>
    </div>
  );
}
