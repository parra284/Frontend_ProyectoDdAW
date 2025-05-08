import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { loginService } from "./authService";
import { useAuth } from "../contexts/AuthContext";

export default function LogIn() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await loginService(data);
      login(response.accessToken);
      navigate('/products');
    } catch (error) {
      alert(error.message)
    }
  }

  return <AuthForm onSubmit={onSubmit} type="Log In"/>;
}