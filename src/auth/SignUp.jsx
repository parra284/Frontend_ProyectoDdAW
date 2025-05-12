import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { signUp } from "./authService";
import { fields } from "../utils/formFields";

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
    <div className="bg-signup min-h-screen bg-cover bg-center">
      <AuthForm
      onSubmit={onSubmit} 
      type="Sign Up" 
      fields={fields}
      message='Already have an account?'
      link="login"
      />
    </div>
  );
}