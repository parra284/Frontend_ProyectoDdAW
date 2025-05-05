import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
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

  return <AuthForm onSubmit={onSubmit} type="Sign Up"/>;
}