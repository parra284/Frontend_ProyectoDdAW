import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import { signUp } from "./authService";

export default function SignUp() {
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await signUp(data);
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
    console.log(data);
  };

  const fields = [
    { name: "name", label: "Name", required: true, pattern: /^[A-Za-z]+$/, errorMsg: "This field can only contain letters" },
    { name: "lastName", label: "Last Name", required: false, pattern: /^[A-Za-z]+$/, errorMsg: "This field can only contain letters" },
    { name: "email", label: "Email", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMsg: "Please enter a valid email address" },
    { name: "password", label: "Password", required: true, minLength: 6, errorMsg: "Password must be at least 6 characters long" }
  ];

  return (
    <div className="bg-signup min-h-screen bg-cover bg-center flex items-center justify-center w-full px-2 py-8">
      <div className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 sm:p-6 md:p-8 bg-white bg-opacity-90 rounded-lg shadow-md mx-2 sm:mx-4">
        <Form 
          type="Sign Up" 
          onSubmit={onSubmit} 
          fields={fields}
        />
        <p className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-6 text-center">
          <span>Already have an account?</span>
          <a
            href="/login"
            className="text-blue-500 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}