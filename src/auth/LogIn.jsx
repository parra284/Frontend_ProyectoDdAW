import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import { login } from "./authService";

export default function LogIn() {
  const navigate = useNavigate();  
  
  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/products")
    } catch (error) {
      alert(error.message);
    }
  };

  const fields = [
    { name: "email", label: "Email", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMsg: "Please enter a valid email address" },
    { name: "password", label: "Password", required: true, minLength: 6, errorMsg: "Password must be at least 6 characters long" }
  ];

  return (
    <div className="bg-login min-h-screen bg-cover bg-center flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 bg-white bg-opacity-90 rounded-lg shadow-md mx-4">
        <Form 
        type="Log In" 
        onSubmit={onSubmit} 
        fields={fields}
        />
        <p className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-6">
          <span>Don't have an account?</span>
          <a
            href="/signup"
            className="text-blue-500 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}