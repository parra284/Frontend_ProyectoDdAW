import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import fields from "../utils/AuthFormFields";
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
  }

  return <AuthForm
  onSubmit={onSubmit} 
  type="signup"
  fields={fields()}
  message="Already have an account?"
  />;
}