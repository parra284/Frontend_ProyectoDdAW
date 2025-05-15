import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import { login } from "./authService";
import { authFields } from "../utils/formFields";

export default function LogIn() {
  const navigate = useNavigate();

  const filteredFields = authFields.filter(field => field.name !== "name" && field.name !== "lastName");

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      localStorage.setItem('accessToken', response.accessToken);
      navigate('/products')
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-login min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
      <div
      className='flex flex-col items-center justify-around w-full max-w-md p-4 bg-white bg-opacity-90 rounded-lg shadow-md'
      >
        <Form 
        onSubmit={onSubmit} 
        type="Log In"
        fields={filteredFields}
        />
        <p className="flex items-center space-x-2">
          <span>Don't have an account?</span>
          <a
            href={`/signup`}
            className="text-blue-500 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>

  );
}