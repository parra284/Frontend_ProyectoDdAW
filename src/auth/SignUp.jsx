import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import { signUp } from "./authService";
import { authFields } from "../utils/formFields";

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

  return (
    <div className="bg-signup min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
      <div
      className='flex flex-col items-center justify-around w-full max-w-md p-4 bg-white bg-opacity-90 rounded-lg shadow-md'
      >
        <Form
        onSubmit={onSubmit} 
        type="Sign Up" 
        fields={authFields}
        />
        <p className="flex items-center space-x-2">
          <span>Already have an account?</span>
          <a
            href={`/login`}
            className="text-blue-500 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}