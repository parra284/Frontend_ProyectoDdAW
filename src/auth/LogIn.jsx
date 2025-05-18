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
    { name: "password", label: "Password", required: true, minLength: 6, errorMsg: "Password must be at least 6 characters long", type: "password" }
  ];

  return (
    <div className="bg-login min-h-screen bg-cover bg-center flex items-center justify-center w-full px-2 py-8">
      <div className="flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 bg-white bg-opacity-90 rounded-lg shadow-md mx-auto">
        <Form 
          type="Log In" 
          onSubmit={onSubmit} 
          fields={fields}
        />        <p className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-6 text-center font-ginora">
          <span>Don't have an account?</span>
          <a
            href="/signup"
            className="text-primary underline hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}